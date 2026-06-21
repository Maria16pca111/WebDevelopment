export type Member = {
  id: string
  dateOfBrith: string
  imageUrl?: string
  displayName: string
  email: string
  created: string
  lastActive: string
  gender: string
  description: string
  city: string
  country: string
}
export type Photo = {
    id: number
    url: string
    publicid : any
    memberId: string
}