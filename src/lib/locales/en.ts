const en = {
	nav: {
		home: 'Home',
		newPost: 'New Post',
		search: 'Search',
		signIn: 'Sign in',
		signOut: 'Sign out',
		searchPlaceholder: 'Search forum…'
	},
	common: {
		loading: 'Loading...',
		loadingMore: 'Loading…',
		loadMore: 'Load more',
		cancel: 'Cancel',
		backToForum: 'Back to all discussions',
		justNow: 'just now',
		ago: 'ago'
	},
	home: {
		latestDiscussions: 'Latest discussions',
		noDiscussions: 'No discussions yet',
		beTheFirst: 'Be the first to start one.',
		newPost: 'New post'
	},
	topic: {
		newPost: 'New post',
		maintainersOnly: 'Maintainers only',
		requiresRep: 'Requires {count} rep',
		all: 'All',
		posts: 'Posts',
		articles: 'Articles',
		nothingHere: 'Nothing here yet',
		noItemsInTopic: 'No {filter} in this topic.',
		topicNotFound: 'Topic not found'
	},
	thread: {
		article: 'Article',
		locked: 'Locked',
		pinned: 'Pinned',
		edit: 'Edit',
		delete: 'Delete',
		deleting: 'Deleting…',
		report: 'Report',
		title: 'Title',
		topic: 'Topic',
		body: 'Body',
		saveChanges: 'Save changes',
		saving: 'Saving…',
		comment: 'comment',
		comments: 'comments',
		lockedNotice: 'This discussion is locked. New comments are disabled.',
		readOnlySnapshot: "You're viewing a read-only snapshot.",
		signInToJoin: 'Sign in',
		toJoinDiscussion: 'to join the discussion.',
		addComment: 'Add a comment',
		comment: 'Comment',
		posting: 'Posting…',
		discussionNotFound: 'Discussion not found.',
		notInArchive: 'This post is not in the read-only archive yet — sign in to view it live.'
	},
	profile: {
		overview: 'Overview',
		posts: 'Posts',
		comments: 'Comments',
		rep: 'rep',
		post: 'post',
		posts: 'posts',
		comment: 'comment',
		comments: 'comments',
		joinedGitHub: 'Joined GitHub',
		githubProfile: 'GitHub profile',
		noPosts: 'No posts yet',
		hasntPosted: "hasn't started any discussions.",
		noComments: 'No comments yet',
		hasntCommented: "hasn't commented on any discussions.",
		commentDetailsNotArchived: "Comment details aren't part of the read-only snapshot — sign in to browse them.",
		showingRecent: 'Showing the {shown} most recent of {total} comments.',
		profileNotFound: 'Profile not found',
		noArchivedActivity: 'This user has no archived activity — sign in to view the full profile.'
	},
	search: {
		title: 'Search',
		typeQuery: 'Type a query in the search box above to find discussions.',
		results: 'result',
		resultsPlural: 'results',
		searchingFor: 'Searching for',
		noResults: 'No results',
		tryDifferent: 'Try a different search term.'
	},
	new: {
		createNew: 'Create a new {kind}',
		post: 'Post',
		article: 'Article',
		articleDesc: 'Articles are long-form writeups, shown with a distinct reading layout.',
		postDesc: 'Posts are regular forum threads.',
		topic: 'Topic',
		title: 'Title',
		titlePlaceholder: 'A clear, descriptive title',
		body: 'Body',
		publish: 'Publish {kind}',
		publishing: 'Publishing…',
		noTopics: 'No topics available',
		noTopicsDesc: "You don't have permission to post in any topic on this forum."
	},
	auth: {
		signInWithGitHub: 'Sign in with GitHub',
		signInDesc: 'The forum runs entirely on the GitHub API, so a GitHub account is required to browse and post.',
		continueWithGitHub: 'Continue with GitHub',
		personalAccessToken: 'Personal access token',
		createToken: 'Create a fine-grained token with read/write access to Discussions on the forum repository. It is stored only in this browser.',
		signInWithToken: 'Sign in with token',
		signingIn: 'Signing in…',
		noSignInMethod: 'No sign-in method is enabled — set auth.allowToken or configure OAuth in forum.config.ts.',
		missingOAuthParams: 'Missing OAuth parameters.',
		completingSignIn: 'Completing sign in…',
		backToForum: 'Back to the forum'
	},
	layout: {
		almostThere: 'Almost there…',
		noRepoConfigured: 'No repository is configured. Set repo.owner and repo.name in forum.config.ts, or deploy with the included GitHub Actions workflow to auto-detect them.',
		readOnlyBanner: 'Read-only snapshot — sign in to post, comment, and react.',
		signIn: 'Sign in'
	},
	signInPrompt: {
		signInToBrowse: 'Sign in to browse {site}',
		signInToBrowseDesc: 'This forum is powered by GitHub Discussions, and the GitHub API requires an authenticated account to read and post.',
		signInWithGitHub: 'Sign in with GitHub'
	}
};

export default en;
