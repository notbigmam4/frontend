export type UserType = {
    id: string
    status: "active" | "pending"
    slug: string

    img: string | undefined
    name: string | undefined
    birthday:string | undefined
  }