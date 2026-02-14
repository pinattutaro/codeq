// 共通の型定義
export interface UserProfile {
  id: string
  email: string
  name: string | null
  displayName: string | null
  avatarUrl: string | null
  bio: string | null
  createdAt: Date
}

export interface QuestionWithDetails {
  id: string
  title: string
  body: string
  createdAt: Date
  updatedAt: Date
  viewCount: number
  author: {
    id: string
    name: string | null
    displayName: string | null
    avatarUrl: string | null
  }
  tags: {
    tag: {
      id: string
      name: string
      color: string
    }
  }[]
  _count: {
    answers: number
    votes: number
  }
  voteScore: number
}

export interface AnswerWithDetails {
  id: string
  body: string
  isAccepted: boolean
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    name: string | null
    displayName: string | null
    avatarUrl: string | null
  }
  _count: {
    votes: number
  }
  voteScore: number
}

export interface TagWithCount {
  id: string
  name: string
  description: string | null
  color: string
  _count: {
    questions: number
  }
}

// API レスポンス型
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// フォーム入力型
export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  name: string
}

export interface QuestionInput {
  title: string
  body: string
  tags: string[]
}

export interface AnswerInput {
  body: string
}
