<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { swr, writeCache } from '$lib/cache';
	import CommentCard from '$lib/components/CommentCard.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
	import ReactionBar from '$lib/components/ReactionBar.svelte';
	import SignInPrompt from '$lib/components/SignInPrompt.svelte';
	import T from '$lib/components/T.svelte';
	import UserBadges from '$lib/components/UserBadges.svelte';
	import { forumConfig } from '$lib/config';
	import {
		addComment,
		deleteDiscussion,
		getDiscussion,
		isArticle,
		stripMarker,
		toggleUpvote,
		updateDiscussion
	} from '$lib/github/api';
	import { auth } from '$lib/github/auth.svelte';
	import type { Comment, Discussion, Reply } from '$lib/github/types';
	import { fetchArchivedDiscussion } from '$lib/archive/client';
	import { archiveMode, isMaintainer, ui } from '$lib/ui.svelte';
	import { formatDate, timeAgo } from '$lib/utils';

	let discussion = $state<Discussion | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	let commentBody = $state('');
	let posting = $state(false);
	let postError = $state<string | null>(null);
	let upvoteBusy = $state(false);

	const number = $derived(Number(page.params.number));
	const article = $derived(discussion ? isArticle(discussion.body) : false);

	// GitHub only allows the author and users with repo write access to edit
	// or delete a discussion — mirror that in the UI
	const canModerate = $derived(
		!!discussion &&
			!!auth.viewer &&
			(auth.viewer.login === discussion.author?.login || isMaintainer())
	);
	const reportUrl = $derived(
		discussion
			? `https://github.com/contact/report-content?content_url=${encodeURIComponent(discussion.url)}`
			: '#'
	);

	// inline moderation editor
	let editing = $state(false);
	let editTitle = $state('');
	let editCategoryId = $state('');
	let editBody = $state('');
	let editBusy = $state(false);
	let editError = $state<string | null>(null);

	function startEdit() {
		if (!discussion) return;
		editTitle = discussion.title;
		editCategoryId = discussion.category.id;
		editBody = stripMarker(discussion.body);
		editError = null;
		editing = true;
	}

	async function saveEdit(e: SubmitEvent) {
		e.preventDefault();
		if (!discussion || !editTitle.trim() || !editBody.trim()) return;
		editBusy = true;
		editError = null;
		try {
			// preserve the post's article/post type
			const body = article
				? `${forumConfig.content.articles.marker}\n\n${editBody}`
				: editBody;
			const updated = await updateDiscussion(discussion.id, {
				title: editTitle.trim(),
				body,
				categoryId: editCategoryId
			});
			Object.assign(discussion, updated);
			persist();
			editing = false;
		} catch (err) {
			editError = err instanceof Error ? err.message : 'Failed to save changes.';
		} finally {
			editBusy = false;
		}
	}

	let deleteBusy = $state(false);
	async function removeDiscussion() {
		if (!discussion || deleteBusy) return;
		if (!confirm('Permanently delete this post and all its comments?')) return;
		deleteBusy = true;
		try {
			await deleteDiscussion(discussion.id);
			await goto(resolve('/'));
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to delete the post.';
			deleteBusy = false;
		}
	}

	let loadedFor: number | null = null;
	$effect(() => {
		if (
			(auth.signedIn || (!auth.loading && archiveMode())) &&
			number &&
			loadedFor !== number
		) {
			loadedFor = number;
			load(number);
		}
	});

	async function load(n: number) {
		loading = true;
		error = null;
		discussion = null;
		// read-only archive mode: fetch the archived thread instead of the API
		if (archiveMode()) {
			const archived = await fetchArchivedDiscussion(n);
			if (!archived) {
				error = 'This post is not in the read-only archive yet — sign in to view it live.';
				loading = false;
				return;
			}
			discussion = archived;
			loading = false;
			return;
		}
		try {
			await swr(`discussion:${n}`, () => getDiscussion(n), (fresh) => {
				discussion = fresh;
				loading = false;
			});
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load the discussion.';
		} finally {
			loading = false;
		}
	}

	function persist() {
		if (discussion) writeCache(`discussion:${discussion.number}`, discussion);
	}

	async function submitComment(e: SubmitEvent) {
		e.preventDefault();
		if (!commentBody.trim() || posting) return;
		posting = true;
		postError = null;
		try {
			const comment = await addComment(discussion!.id, commentBody);
			discussion!.comments.nodes = [comment, ...discussion!.comments.nodes];
			discussion!.comments.totalCount++;
			commentBody = '';
			persist();
		} catch (err) {
			postError = err instanceof Error ? err.message : 'Failed to post the comment.';
		} finally {
			posting = false;
		}
	}

	async function upvote() {
		if (!discussion || upvoteBusy) return;
		upvoteBusy = true;
		const on = !discussion.viewerHasUpvoted;
		discussion.viewerHasUpvoted = on;
		discussion.upvoteCount += on ? 1 : -1;
		try {
			await toggleUpvote(discussion.id, on);
			persist();
		} catch {
			discussion.viewerHasUpvoted = !on;
			discussion.upvoteCount += on ? -1 : 1;
		} finally {
			upvoteBusy = false;
		}
	}
</script>

<svelte:head>
	<title>{discussion ? `${discussion.title} — ${forumConfig.site.name}` : forumConfig.site.name}</title>
</svelte:head>

{#if auth.loading}
	<Loading />
{:else if !auth.signedIn && !(archiveMode() && ui.bootedFromArchive)}
	<SignInPrompt />
{:else if loading}
	<Loading />
{:else if error}
	<div class="mx-auto max-w-2xl pt-10">
		<div class="rounded-2xl border border-dashed border-fd-border py-16 text-center">
			<p class="font-medium text-red-500">{error}</p>
			<a href={resolve('/')} class="mt-2 inline-block text-sm text-fd-link hover:underline">
				<T key="common.backToForum" />
			</a>
		</div>
	</div>
{:else if discussion}
	<article class="mx-auto max-w-3xl">
		<div class="mb-6">
			<div class="flex flex-wrap items-start justify-between gap-4">
				<div class="min-w-0">
					<div class="flex items-center gap-2">
						<h1 class="text-2xl font-bold tracking-tight">{discussion.title}</h1>
						{#if article}
							<span class="rounded-full border border-fd-border bg-fd-muted px-2 py-0.5 text-[11px] font-medium text-fd-muted-foreground">
								<T key="thread.article" />
							</span>
						{/if}
						{#if discussion.locked}
							<span class="rounded-full border border-fd-border bg-fd-muted px-2 py-0.5 text-[11px] font-medium text-fd-muted-foreground">
								<T key="thread.locked" />
							</span>
						{/if}
					</div>
					<p class="mt-1 text-sm text-fd-muted-foreground">
						<a
							href={resolve('/t/[slug]', { slug: discussion.category.slug })}
							class="hover:underline"
						>
							<span class="leading-none">{@html discussion.category.emojiHTML}</span>
							{discussion.category.name}
						</a>
						· {formatDate(discussion.createdAt)}
						{#if discussion.lastEditedAt}
							· edited {timeAgo(discussion.lastEditedAt)}
						{/if}
					</p>
				</div>
				<div class="flex items-center gap-2">
					{#if forumConfig.features.upvotes}
						<button
							type="button"
							onclick={upvote}
							disabled={upvoteBusy}
							class="inline-flex items-center gap-1.5 rounded-lg border border-fd-border px-3 py-1.5 text-sm font-medium transition-colors {discussion.viewerHasUpvoted
								? 'border-fd-ring bg-fd-accent'
								: 'hover:bg-fd-accent'}"
						>
							<svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6" /></svg>
							{discussion.upvoteCount}
						</button>
					{/if}
					{#if forumConfig.features.reactions}
						<ReactionBar subjectId={discussion.id} groups={discussion.reactionGroups} />
					{/if}
					{#if canModerate}
						<button
							type="button"
							onclick={startEdit}
							class="inline-flex items-center gap-1.5 rounded-lg border border-fd-border px-3 py-1.5 text-sm font-medium hover:bg-fd-accent"
						>
							<T key="thread.edit" />
						</button>
						<button
							type="button"
							onclick={removeDiscussion}
							disabled={deleteBusy}
							class="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-500/5 disabled:opacity-50"
						>
							{deleteBusy ? 'Deleting…' : 'Delete'}
						</button>
					{/if}
					<a
						href={reportUrl}
						target="_blank"
						rel="noreferrer"
						class="inline-flex items-center gap-1.5 rounded-lg border border-fd-border px-3 py-1.5 text-sm font-medium text-fd-muted-foreground hover:bg-fd-accent"
					>
						<T key="thread.report" />
					</a>
				</div>
			</div>
		</div>

		{#if editing}
			<form onsubmit={saveEdit} class="mb-6 flex flex-col gap-4 rounded-2xl border border-fd-border bg-fd-card p-4">
				<div>
					<label class="mb-1 block text-sm font-medium" for="dk-edit-title"><T key="thread.title" /></label>
					<input
						id="dk-edit-title"
						bind:value={editTitle}
						class="w-full rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fd-ring"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="dk-edit-topic"><T key="thread.topic" /></label>
					<select
						id="dk-edit-topic"
						bind:value={editCategoryId}
						class="w-full rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fd-ring sm:max-w-xs"
					>
						{#each ui.categories as category (category.id)}
							<option value={category.id}>{category.name}</option>
						{/each}
					</select>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium" for="dk-edit-body"><T key="thread.body" /></label>
					<MarkdownEditor bind:value={editBody} rows={8} />
				</div>
				{#if editError}<p class="text-sm text-red-500">{editError}</p>{/if}
				<div class="flex justify-end gap-2">
					<button
						type="button"
						onclick={() => (editing = false)}
						class="rounded-lg px-4 py-2 text-sm text-fd-muted-foreground hover:bg-fd-accent"
					>
						<T key="common.cancel" />
					</button>
					<button
						type="submit"
						disabled={editBusy || !editTitle.trim() || !editBody.trim()}
						class="rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
					>
						{editBusy ? 'Saving…' : 'Save changes'}
					</button>
				</div>
			</form>
		{:else}
			<div class="markdown mb-8 rounded-2xl border border-fd-border bg-fd-card p-6">
				{@html discussion.bodyHTML}
			</div>
		{/if}

		<div class="mb-6 flex items-center gap-3 border-t border-fd-border pt-6">
			{#if discussion.author}
				<a href={resolve('/u/[login]', { login: discussion.author.login })} class="flex items-center gap-2.5">
					<img
						src={discussion.author.avatarUrl}
						alt={discussion.author.login}
						class="size-9 rounded-full border border-fd-border"
					/>
					<div>
						<div class="flex items-center gap-1.5">
							<span class="text-sm font-medium">{discussion.author.login}</span>
							<UserBadges login={discussion.author.login} />
						</div>
						<span class="text-xs text-fd-muted-foreground">{timeAgo(discussion.createdAt)}</span>
					</div>
				</a>
			{/if}
			<span class="ml-auto text-sm text-fd-muted-foreground">
				{discussion.comments.totalCount} {discussion.comments.totalCount === 1 ? 'comment' : 'comments'}
			</span>
		</div>

		{#if discussion.locked}
			<p class="mb-6 rounded-xl border border-fd-border bg-fd-muted/50 p-4 text-sm text-fd-muted-foreground">
				<T key="thread.lockedNotice" />
			</p>
		{:else if archiveMode()}
			<p class="mb-6 rounded-xl border border-fd-border bg-fd-muted/50 p-4 text-sm text-fd-muted-foreground">
				<T key="thread.readOnlySnapshot" />
			</p>
		{/if}

		<div class="flex flex-col gap-4">
			{#each discussion.comments.nodes as comment (comment.id)}
				<CommentCard
					{comment}
					discussionId={discussion.id}
					locked={discussion.locked}
					onposted={(reply) => {
						comment.replies.nodes = [...comment.replies.nodes, reply];
						comment.replies.totalCount++;
						discussion.comments.totalCount++;
					}}
				/>
			{/each}
		</div>

		{#if auth.signedIn}
			{#if !discussion.locked}
				<form onsubmit={submitComment} class="mt-6">
					<h3 class="mb-2 text-sm font-medium"><T key="thread.addComment" /></h3>
					<MarkdownEditor bind:value={commentBody} />
					{#if postError}<p class="mt-2 text-sm text-red-500">{postError}</p>{/if}
					<div class="mt-3 flex justify-end">
						<button
							type="submit"
							disabled={posting || !commentBody.trim()}
							class="rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
						>
							{posting ? 'Posting…' : 'Comment'}
						</button>
					</div>
				</form>
			{/if}
		{:else if archiveMode() && ui.bootedFromArchive}
			<div class="mt-6 rounded-xl border border-dashed border-fd-border p-4 text-center text-sm text-fd-muted-foreground">
				<T key="thread.readOnlySnapshot" />
				<button
					type="button"
					onclick={() => (ui.signInOpen = true)}
					class="font-medium text-fd-link hover:underline"
				>
					<T key="thread.signInToJoin" />
				</button>
				<T key="thread.toJoinDiscussion" />
			</div>
		{:else}
			<form onsubmit={submitComment} class="mt-6">
				<h3 class="mb-2 text-sm font-medium"><T key="thread.addComment" /></h3>
				<MarkdownEditor bind:value={commentBody} />
				{#if postError}<p class="mt-2 text-sm text-red-500">{postError}</p>{/if}
				<div class="mt-3 flex justify-end">
					<button
						type="submit"
						disabled={posting || !commentBody.trim()}
						class="rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
					>
						{posting ? 'Posting…' : 'Comment'}
					</button>
				</div>
			</form>
		{/if}
	</article>
{/if}
