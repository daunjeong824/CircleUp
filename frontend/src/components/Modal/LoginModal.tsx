import { useState, ChangeEvent, FormEvent } from "react";
import { getUserCourse, postLogin } from "../../services/api";
import { useUserStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { CourseInfo } from "../../types/CourseInfo";
import { Bounce, toast } from "react-toastify";

interface ModalProps {
  show: boolean;
  onClose: () => void;
}

function LoginModal({ show, onClose }: ModalProps) {
  const navigate = useNavigate();
  const [inputEmail, setInputEmail] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const { setNickName, setEmail, setRole, setMyCourseId, setIsLoggedIn } = useUserStore();

  const loginInfo = {
    email: inputEmail,
    password: pwd,
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputEmail(e.target.value);
  };

  const handlePwdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPwd(e.target.value);
  };

  const getMyCourses = async () => {
    const response = await getUserCourse();
    const myCourseIds = response.data.map((course: CourseInfo) => course.id);
    setMyCourseId(myCourseIds);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await postLogin(loginInfo);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("userId", response.data.email);

      setEmail(response.data.email);
      setNickName(response.data.name);
      setRole(response.data.role);
      setIsLoggedIn(true);
      getMyCourses();

      toast.info("로그인 성공!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      onClose();
      navigate("/");
    } catch (error) {
      toast.error("로그인에 실패하셨습니다.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
      <div id="authentication-modal" className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <div className="flex">
              <svg
                className="mx-auto"
                width="120"
                zoomAndPan="magnify"
                viewBox="0 0 224.87999 89.999999"
                preserveAspectRatio="xMidYMid meet"
                version="1.0"
              >
                <defs>
                  <g />
                  <clipPath id="1862d06f4c">
                    <path
                      d="M 0 0.0234375 L 224.761719 0.0234375 L 224.761719 89.976562 L 0 89.976562 Z M 0 0.0234375 "
                      clipRule="nonzero"
                    />
                  </clipPath>
                  <clipPath id="7cd468f544">
                    <path
                      d="M 48.789062 21.6875 L 57.785156 21.6875 L 57.785156 31.433594 L 48.789062 31.433594 Z M 48.789062 21.6875 "
                      clipRule="nonzero"
                    />
                  </clipPath>
                  <clipPath id="97c7ba3732">
                    <path
                      d="M 183.464844 23.207031 L 190.960938 23.207031 L 190.960938 30.703125 L 183.464844 30.703125 Z M 183.464844 23.207031 "
                      clipRule="nonzero"
                    />
                  </clipPath>
                </defs>
                <g clip-path="url(#1862d06f4c)">
                  <path
                    fill="#ffffff"
                    d="M 0 0.0234375 L 224.878906 0.0234375 L 224.878906 89.976562 L 0 89.976562 Z M 0 0.0234375 "
                    fill-opacity="1"
                    fill-rule="nonzero"
                  />
                  <path
                    fill="#ffffff"
                    d="M 0 0.0234375 L 224.878906 0.0234375 L 224.878906 89.976562 L 0 89.976562 Z M 0 0.0234375 "
                    fill-opacity="1"
                    fill-rule="nonzero"
                  />
                </g>
                <g fill="#5271ff" fill-opacity="1">
                  <g transform="translate(14.048348, 60.582478)">
                    <g>
                      <path d="M 23.53125 -8.015625 C 24.882812 -8.015625 26.195312 -8.21875 27.46875 -8.625 C 28.75 -9.039062 29.6875 -9.4375 30.28125 -9.8125 L 31.1875 -10.421875 L 34.953125 -2.875 C 34.828125 -2.78125 34.65625 -2.65625 34.4375 -2.5 C 34.21875 -2.34375 33.707031 -2.050781 32.90625 -1.625 C 32.101562 -1.195312 31.242188 -0.828125 30.328125 -0.515625 C 29.421875 -0.203125 28.226562 0.078125 26.75 0.328125 C 25.269531 0.578125 23.742188 0.703125 22.171875 0.703125 C 18.554688 0.703125 15.128906 -0.179688 11.890625 -1.953125 C 8.648438 -3.734375 6.035156 -6.179688 4.046875 -9.296875 C 2.066406 -12.410156 1.078125 -15.773438 1.078125 -19.390625 C 1.078125 -22.117188 1.660156 -24.742188 2.828125 -27.265625 C 3.992188 -29.785156 5.539062 -31.941406 7.46875 -33.734375 C 9.40625 -35.523438 11.660156 -36.953125 14.234375 -38.015625 C 16.816406 -39.085938 19.460938 -39.625 22.171875 -39.625 C 24.679688 -39.625 27 -39.320312 29.125 -38.71875 C 31.25 -38.125 32.753906 -37.53125 33.640625 -36.9375 L 34.953125 -36.046875 L 31.1875 -28.484375 C 30.957031 -28.679688 30.625 -28.910156 30.1875 -29.171875 C 29.75 -29.441406 28.867188 -29.796875 27.546875 -30.234375 C 26.222656 -30.671875 24.882812 -30.890625 23.53125 -30.890625 C 21.394531 -30.890625 19.476562 -30.546875 17.78125 -29.859375 C 16.082031 -29.171875 14.738281 -28.257812 13.75 -27.125 C 12.757812 -25.988281 12.003906 -24.769531 11.484375 -23.46875 C 10.960938 -22.164062 10.703125 -20.835938 10.703125 -19.484375 C 10.703125 -16.523438 11.8125 -13.875 14.03125 -11.53125 C 16.25 -9.1875 19.414062 -8.015625 23.53125 -8.015625 Z M 23.53125 -8.015625 " />
                    </g>
                  </g>
                </g>
                <g fill="#5271ff" fill-opacity="1">
                  <g transform="translate(45.884446, 60.582478)">
                    <g>
                      <path d="M 3.625 -37.6875 C 4.601562 -38.664062 5.769531 -39.15625 7.125 -39.15625 C 8.476562 -39.15625 9.640625 -38.664062 10.609375 -37.6875 C 11.585938 -36.71875 12.078125 -35.554688 12.078125 -34.203125 C 12.078125 -32.847656 11.585938 -31.679688 10.609375 -30.703125 C 9.640625 -29.734375 8.476562 -29.25 7.125 -29.25 C 5.769531 -29.25 4.601562 -29.734375 3.625 -30.703125 C 2.65625 -31.679688 2.171875 -32.847656 2.171875 -34.203125 C 2.171875 -35.554688 2.65625 -36.71875 3.625 -37.6875 Z M 2.828125 -24.203125 L 2.828125 0 L 11.1875 0 L 11.1875 -24.203125 Z M 2.828125 -24.203125 " />
                    </g>
                  </g>
                </g>
                <g fill="#5271ff" fill-opacity="1">
                  <g transform="translate(56.44931, 60.582478)">
                    <g>
                      <path d="M 2.828125 0 L 2.828125 -24.203125 L 11.1875 -24.203125 L 11.1875 -20.703125 L 11.28125 -20.703125 C 11.34375 -20.828125 11.441406 -20.984375 11.578125 -21.171875 C 11.722656 -21.367188 12.03125 -21.703125 12.5 -22.171875 C 12.96875 -22.640625 13.46875 -23.0625 14 -23.4375 C 14.539062 -23.820312 15.234375 -24.160156 16.078125 -24.453125 C 16.929688 -24.753906 17.800781 -24.90625 18.6875 -24.90625 C 19.59375 -24.90625 20.484375 -24.78125 21.359375 -24.53125 C 22.242188 -24.28125 22.890625 -24.03125 23.296875 -23.78125 L 23.96875 -23.390625 L 20.46875 -16.328125 C 19.4375 -17.203125 17.988281 -17.640625 16.125 -17.640625 C 15.125 -17.640625 14.257812 -17.421875 13.53125 -16.984375 C 12.8125 -16.546875 12.300781 -16.007812 12 -15.375 C 11.707031 -14.75 11.5 -14.210938 11.375 -13.765625 C 11.25 -13.328125 11.1875 -12.984375 11.1875 -12.734375 L 11.1875 0 Z M 2.828125 0 " />
                    </g>
                  </g>
                </g>
                <g fill="#5271ff" fill-opacity="1">
                  <g transform="translate(76.258438, 60.582478)">
                    <g>
                      <path d="M 15.703125 -18.0625 C 14.128906 -18.0625 12.773438 -17.476562 11.640625 -16.3125 C 10.515625 -15.15625 9.953125 -13.757812 9.953125 -12.125 C 9.953125 -10.457031 10.515625 -9.039062 11.640625 -7.875 C 12.773438 -6.707031 14.128906 -6.125 15.703125 -6.125 C 16.460938 -6.125 17.179688 -6.21875 17.859375 -6.40625 C 18.535156 -6.601562 19.03125 -6.796875 19.34375 -6.984375 L 19.765625 -7.265625 L 22.59375 -1.46875 C 22.375 -1.300781 22.066406 -1.097656 21.671875 -0.859375 C 21.273438 -0.628906 20.378906 -0.3125 18.984375 0.09375 C 17.585938 0.5 16.085938 0.703125 14.484375 0.703125 C 10.929688 0.703125 7.804688 -0.546875 5.109375 -3.046875 C 2.421875 -5.546875 1.078125 -8.539062 1.078125 -12.03125 C 1.078125 -15.550781 2.421875 -18.578125 5.109375 -21.109375 C 7.804688 -23.640625 10.929688 -24.90625 14.484375 -24.90625 C 16.085938 -24.90625 17.5625 -24.71875 18.90625 -24.34375 C 20.257812 -23.96875 21.222656 -23.585938 21.796875 -23.203125 L 22.59375 -22.640625 L 19.765625 -16.9375 C 18.722656 -17.6875 17.367188 -18.0625 15.703125 -18.0625 Z M 15.703125 -18.0625 " />
                    </g>
                  </g>
                </g>
                <g fill="#5271ff" fill-opacity="1">
                  <g transform="translate(95.737415, 60.582478)">
                    <g>
                      <path d="M 2.828125 0 L 2.828125 -40.5625 L 11.1875 -40.5625 L 11.1875 0 Z M 2.828125 0 " />
                    </g>
                  </g>
                </g>
                <g fill="#5271ff" fill-opacity="1">
                  <g transform="translate(106.066455, 60.582478)">
                    <g>
                      <path d="M 27.3125 -10.9375 L 9.765625 -10.9375 C 9.765625 -9.238281 10.3125 -7.976562 11.40625 -7.15625 C 12.507812 -6.34375 13.707031 -5.9375 15 -5.9375 C 16.351562 -5.9375 17.421875 -6.117188 18.203125 -6.484375 C 18.992188 -6.847656 19.890625 -7.5625 20.890625 -8.625 L 26.9375 -5.609375 C 24.414062 -1.398438 20.234375 0.703125 14.390625 0.703125 C 10.742188 0.703125 7.613281 -0.546875 5 -3.046875 C 2.382812 -5.546875 1.078125 -8.554688 1.078125 -12.078125 C 1.078125 -15.597656 2.382812 -18.613281 5 -21.125 C 7.613281 -23.644531 10.742188 -24.90625 14.390625 -24.90625 C 18.222656 -24.90625 21.34375 -23.796875 23.75 -21.578125 C 26.15625 -19.359375 27.359375 -16.191406 27.359375 -12.078125 C 27.359375 -11.515625 27.34375 -11.132812 27.3125 -10.9375 Z M 10 -15.5625 L 19.203125 -15.5625 C 19.015625 -16.820312 18.519531 -17.789062 17.71875 -18.46875 C 16.914062 -19.144531 15.882812 -19.484375 14.625 -19.484375 C 13.238281 -19.484375 12.132812 -19.117188 11.3125 -18.390625 C 10.5 -17.671875 10.0625 -16.726562 10 -15.5625 Z M 10 -15.5625 " />
                    </g>
                  </g>
                </g>
                <g fill="#5271ff" fill-opacity="1">
                  <g transform="translate(130.82787, 60.582478)">
                    <g>
                      <path d="M 2.828125 -17.265625 L 18.015625 -17.265625 L 18.015625 -10.046875 L 2.828125 -10.046875 Z M 2.828125 -17.265625 " />
                    </g>
                  </g>
                </g>
                <g fill="#5271ff" fill-opacity="1">
                  <g transform="translate(147.995777, 60.582478)">
                    <g>
                      <path d="M 32.734375 -38.921875 L 32.734375 -13.828125 C 32.734375 -9.046875 31.441406 -5.425781 28.859375 -2.96875 C 26.285156 -0.519531 22.515625 0.703125 17.546875 0.703125 C 12.578125 0.703125 8.800781 -0.519531 6.21875 -2.96875 C 3.644531 -5.425781 2.359375 -9.046875 2.359375 -13.828125 L 2.359375 -38.921875 L 11.234375 -38.921875 L 11.234375 -16.421875 C 11.234375 -13.273438 11.726562 -11.085938 12.71875 -9.859375 C 13.707031 -8.628906 15.316406 -8.015625 17.546875 -8.015625 C 19.773438 -8.015625 21.382812 -8.628906 22.375 -9.859375 C 23.375 -11.085938 23.875 -13.273438 23.875 -16.421875 L 23.875 -38.921875 Z M 32.734375 -38.921875 " />
                    </g>
                  </g>
                </g>
                <g fill="#5271ff" fill-opacity="1">
                  <g transform="translate(179.407388, 60.582478)">
                    <g>
                      <path d="M 2.828125 -38.921875 L 17.03125 -38.921875 C 20.988281 -38.921875 24.191406 -37.894531 26.640625 -35.84375 C 29.097656 -33.800781 30.328125 -30.828125 30.328125 -26.921875 C 30.328125 -23.023438 29.082031 -19.96875 26.59375 -17.75 C 24.113281 -15.539062 20.925781 -14.4375 17.03125 -14.4375 L 11.703125 -14.4375 L 11.703125 0 L 2.828125 0 Z M 11.703125 -21.515625 L 14.203125 -21.515625 C 16.179688 -21.515625 17.804688 -21.914062 19.078125 -22.71875 C 20.347656 -23.519531 20.984375 -24.832031 20.984375 -26.65625 C 20.984375 -28.507812 20.347656 -29.835938 19.078125 -30.640625 C 17.804688 -31.441406 16.179688 -31.84375 14.203125 -31.84375 L 11.703125 -31.84375 Z M 11.703125 -21.515625 " />
                    </g>
                  </g>
                </g>
                <g clip-path="url(#7cd468f544)">
                  <path
                    fill="#ffffff"
                    d="M 57.914062 26.300781 L 56.566406 26.300781 C 54.265625 25.800781 53.753906 25.289062 53.253906 22.980469 L 53.253906 21.6875 L 53.085938 21.6875 L 53.085938 22.996094 C 52.585938 25.289062 52.074219 25.800781 49.773438 26.300781 L 48.792969 26.300781 L 48.792969 26.46875 L 49.773438 26.46875 C 52.074219 26.96875 52.585938 27.480469 53.085938 29.777344 L 53.085938 31.058594 L 53.253906 31.058594 L 53.253906 29.789062 C 53.753906 27.484375 54.265625 26.96875 56.566406 26.46875 L 57.914062 26.46875 Z M 57.914062 26.300781 "
                    fill-opacity="1"
                    fill-rule="nonzero"
                  />
                </g>
                <g clip-path="url(#97c7ba3732)">
                  <path
                    fill="#ffffff"
                    d="M 191.101562 27.070312 L 189.976562 27.070312 C 188.046875 26.652344 187.617188 26.222656 187.199219 24.289062 L 187.199219 23.207031 L 187.058594 23.207031 L 187.058594 24.300781 C 186.640625 26.222656 186.210938 26.652344 184.285156 27.070312 L 183.464844 27.070312 L 183.464844 27.210938 L 184.285156 27.210938 C 186.210938 27.628906 186.640625 28.058594 187.058594 29.980469 L 187.058594 31.054688 L 187.199219 31.054688 L 187.199219 29.992188 C 187.617188 28.058594 188.046875 27.628906 189.976562 27.210938 L 191.101562 27.210938 Z M 191.101562 27.070312 "
                    fill-opacity="1"
                    fill-rule="nonzero"
                  />
                </g>
              </svg>
            </div>
            <button
              type="button"
              className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="authentication-modal"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
          <div className="p-4 md:p-5">
            <form className="space-y-4" action="#">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  이메일
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={inputEmail}
                  onChange={handleEmailChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-600 block w-full p-2.5 "
                  placeholder="circle@up.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  비밀번호
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  value={pwd}
                  onChange={handlePwdChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-600 block w-full p-2.5 "
                  required
                />
              </div>
              <div className="flex justify-between">
                {/* <a href="#" className="text-sm text-blue-700 hover:underline dark:text-blue-500">
                                    Lost Password?
                                </a> */}
              </div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                로그인
              </button>
              {/* <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                Not registered?{' '}
                                <a href="#" className="text-blue-700 hover:underline dark:text-blue-500">
                                    Create account
                                </a>
                            </div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
