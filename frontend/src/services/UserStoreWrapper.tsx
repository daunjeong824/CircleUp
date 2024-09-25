import { useEffect } from 'react';
import { useUserStore } from "../store/store";

interface LiveStoreWrapperProps {
    onStoreData: (data: {
      nickName: string;
  email: string;
  role: string;

  setNickName: (newNickName: string) => void;
  setEmail: (newEmail: string) => void;
  setRole: (newRole: string) => void;
    }) => void;
}
  
const LiveStoreWrapper = ({ onStoreData } : LiveStoreWrapperProps) => {
  const { nickName, email, role,
    setNickName, setEmail, setRole, } = useUserStore();

  useEffect(() => {
    // 데이터를 부모 컴포넌트로 전달
    onStoreData({ nickName, email, role, setNickName, setEmail, setRole,  });
  }, [nickName, email, role, setNickName, setEmail, setRole]);

  return null; // UI를 렌더링할 필요가 없으므로 null을 반환
};

export default LiveStoreWrapper;