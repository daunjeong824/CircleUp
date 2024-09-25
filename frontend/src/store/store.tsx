import create from "zustand";
import { persist } from "zustand/middleware";

// 관리자 여부, 닉네임, 이메일
/*
    authorizedLevel
        1 : Admin
        2 : Instructor
        3 : User
*/
interface Store {
  nickName: string;
  email: string;
  role: string;
  myCourseId: number[];
  isLoggedIn: boolean;

  setNickName: (newNickName: string) => void;
  setEmail: (newEmail: string) => void;
  setRole: (newRole: string) => void;
  setMyCourseId: (newMyCourseId: number[]) => void;
  setIsLoggedIn: (status: boolean) => void;
}

export const useUserStore = create(
  persist<Store>(
    (set) => ({
      nickName: "",
      email: "",
      role: "",
      myCourseId: [],
      isLoggedIn: false,

      setNickName: (newNickName) => set({ nickName: newNickName }),
      setEmail: (newEmail) => set({ email: newEmail }),
      setRole: (newRole) => set({ role: newRole }),
      setMyCourseId: (newMyCourseId) => set({ myCourseId: [...newMyCourseId] }),
      setIsLoggedIn: (status) => set({ isLoggedIn: status }),
    }),
    {
      name: "userIdStorage",
    }
  )
);

interface SearchState {
  searchValue: string;
  setSearchValue: (value: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchValue: "",
  setSearchValue: (value) => set({ searchValue: value }),

}));
