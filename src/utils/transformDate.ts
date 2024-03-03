export const transformDate = (date: string) => {
   const year = new Date(date).getFullYear()
   const month =
      new Date(date).getMonth() < 9 ? `0${new Date(date).getMonth() + 1}` : new Date(date).getMonth() + 1

   return `${month}/${year}`
}
