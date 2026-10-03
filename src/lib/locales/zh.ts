import type { Messages } from './types';

const zh: Messages = {
	nav: {
		home: '首页',
		newPost: '发帖',
		search: '搜索',
		signIn: '登录',
		signOut: '退出',
		searchPlaceholder: '搜索论坛…'
	},
	common: {
		loading: '加载中...',
		loadingMore: '加载中…',
		loadMore: '加载更多',
		cancel: '取消',
		backToForum: '返回所有讨论',
		justNow: '刚刚',
		ago: '前'
	},
	home: {
		latestDiscussions: '最新讨论',
		noDiscussions: '还没有讨论',
		beTheFirst: '来发第一帖吧。',
		newPost: '发帖'
	},
	topic: {
		newPost: '发帖',
		maintainersOnly: '仅维护者',
		requiresRep: '需要 {count} 声望',
		all: '全部',
		posts: '帖子',
		articles: '文章',
		nothingHere: '这里还没有内容',
		noItemsInTopic: '该话题下没有{filter}。',
		topicNotFound: '话题不存在'
	},
	thread: {
		article: '文章',
		locked: '已锁定',
		pinned: '已置顶',
		edit: '编辑',
		delete: '删除',
		deleting: '删除中…',
		report: '举报',
		title: '标题',
		topic: '话题',
		body: '正文',
		saveChanges: '保存修改',
		saving: '保存中…',
		comment: '条评论',
		comments: '条评论',
		lockedNotice: '该讨论已锁定，无法回复。',
		readOnlySnapshot: '你正在查看只读快照。',
		signInToJoin: '登录',
		toJoinDiscussion: '参与讨论。',
		addComment: '添加评论',
		comment: '评论',
		posting: '发布中…',
		discussionNotFound: '讨论不存在。',
		notInArchive: '该帖子尚未加入只读快照——请登录查看实时内容。'
	},
	profile: {
		overview: '概览',
		posts: '帖子',
		comments: '评论',
		rep: '声望',
		post: '篇帖子',
		posts: '篇帖子',
		comment: '条评论',
		comments: '条评论',
		joinedGitHub: '加入 GitHub',
		githubProfile: 'GitHub 主页',
		noPosts: '还没有帖子',
		hasntPosted: '还没有发起任何讨论。',
		noComments: '还没有评论',
		hasntCommented: '还没有评论过任何讨论。',
		commentDetailsNotArchived: '评论详情不在只读快照中——请登录浏览。',
		showingRecent: '显示最近 {shown} 条评论，共 {total} 条。',
		profileNotFound: '用户不存在',
		noArchivedActivity: '该用户没有已归档的活动——请登录查看完整资料。'
	},
	search: {
		title: '搜索',
		typeQuery: '在上方搜索框中输入关键词。',
		results: '个结果',
		resultsPlural: '个结果',
		searchingFor: '正在搜索',
		noResults: '没有结果',
		tryDifferent: '换个关键词试试。'
	},
	new: {
		createNew: '新建{kind}',
		post: '帖子',
		article: '文章',
		articleDesc: '文章是长篇内容，使用专门的阅读排版。',
		postDesc: '帖子是常规论坛话题。',
		topic: '话题',
		title: '标题',
		titlePlaceholder: '一个清晰、描述性的标题',
		body: '正文',
		publish: '发布{kind}',
		publishing: '发布中…',
		noTopics: '没有可用话题',
		noTopicsDesc: '你没有权限在该论坛的任何话题中发帖。'
	},
	auth: {
		signInWithGitHub: '使用 GitHub 登录',
		signInDesc: '本论坛完全基于 GitHub API 运行，需要 GitHub 账户才能浏览和发帖。',
		continueWithGitHub: '使用 GitHub 继续',
		personalAccessToken: '个人访问令牌',
		createToken: '创建一个对论坛仓库的 Discussions 有读写权限的细粒度令牌。它仅存储在此浏览器中。',
		signInWithToken: '使用令牌登录',
		signingIn: '登录中…',
		noSignInMethod: '未启用任何登录方式——请在 forum.config.ts 中设置 auth.allowToken 或配置 OAuth。',
		missingOAuthParams: '缺少 OAuth 参数。',
		completingSignIn: '正在完成登录…',
		backToForum: '返回论坛'
	},
	layout: {
		almostThere: '快好了…',
		noRepoConfigured: '未配置仓库。请在 forum.config.ts 中设置 repo.owner 和 repo.name，或使用随附的 GitHub Actions 工作流自动检测。',
		readOnlyBanner: '只读快照——请登录以发帖、评论和互动。',
		signIn: '登录'
	},
	signInPrompt: {
		signInToBrowse: '登录以浏览 {site}',
		signInToBrowseDesc: '本论坛由 GitHub Discussions 提供支持，GitHub API 需要认证账户才能阅读和发帖。',
		signInWithGitHub: '使用 GitHub 登录'
	}
};

export default zh;
