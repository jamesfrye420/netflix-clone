export default interface User {
  _id: string;
  firstName: string;
  email: string;
  password: string;
  photoURL: string;
  watchLater: { movies: string[]; series: string[] }[];
}
