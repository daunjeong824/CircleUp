import { OpenVidu } from "openvidu-browser";
import React, { Component } from "react";
import "../WebRtc/VideoRoomComponent.css";
import StreamComponent from "../WebRtc/stream/StreamComponent";
import ChatComponent from "../WebRtc/chat/ChatComponent";
import ToolbarComponent from "../WebRtc/toolbar/ToolbarComponent";
import OpenViduLayout from "../WebRtc/layout/openvidu-layout";
import UserModel from "../WebRtc/models/user-model";
import { useLocation, useParams } from "react-router";
import { createSession, createToken, leaveLiveSession } from "../services/api"
import UserStoreWrapper from "../services/UserStoreWrapper"

function useTest() {
  const params = useParams();
  const location = useLocation();
  console.log("=================입장===================")
  console.log("course_id >> ", params.course_id)
  console.log("member_id >> ", location.state.memberId)
  console.log("========================================")
  return (
    <VideoRoomComponent
      course_id={params.course_id}
      curriculum_id={location.state.curriId}
      member_id={location.state.memberId}
      isHost={location.state.flag}
    ></VideoRoomComponent>
  );
}

var localUser = new UserModel();
const AI_SERVER_URL = import.meta.env.VITE_AI_ADDRESS;
class VideoRoomComponent extends Component {
  constructor(props) {
    super(props);
    this.hasBeenUpdated = false;
    this.layout = new OpenViduLayout();
    let sessionName = this.props.course_id;
    let userName = this.props.member_id;
    let curriId = this.props.curriId;
    this.remotes = [];
    this.localUserAccessAllowed = false;

    this.state = {
      mySessionId: sessionName,
      myCurriId: curriId,
      myUserName: userName,
      session: undefined,
      localUser: undefined,
      subscribers: [],
      chatDisplay: "none",
      currentVideoDevice: undefined,
      nsfwProb: 0,
      
      nickName: "",
      email: "",
      role: "",
      
      setNickName: () => {},
      setEmail: () => {},
      setRole: () => {},
    };
    
    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
    this.camStatusChanged = this.camStatusChanged.bind(this);
    this.micStatusChanged = this.micStatusChanged.bind(this);
    this.nicknameChanged = this.nicknameChanged.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.switchCamera = this.switchCamera.bind(this);
    this.screenShare = this.screenShare.bind(this);
    this.stopScreenShare = this.stopScreenShare.bind(this);
    this.closeDialogExtension = this.closeDialogExtension.bind(this);
    this.toggleChat = this.toggleChat.bind(this);
    this.checkNotification = this.checkNotification.bind(this);
    this.checkSize = this.checkSize.bind(this);
    this.webSocket = null;
  }

  handleStoreData = (storeData) => {
    this.setState({
      nickName: storeData.nickName,
      email: storeData.email,
      role: storeData.role,
      
      setNickName: storeData.setNickName,
      setEmail: storeData.setEmail,
      setRole: storeData.setRole,
    })
  }

  componentDidMount() {
    const openViduLayoutOptions = {
      maxRatio: 3 / 2,
      minRatio: 9 / 16,
      fixedRatio: false,
      bigClass: "OV_big",
      bigPercentage: 0.8,
      bigFixedRatio: false,
      bigMaxRatio: 3 / 2,
      bigMinRatio: 9 / 16,
      bigFirst: true,
      animate: true,
    };

    this.layout.initLayoutContainer(document.getElementById("layout"), openViduLayoutOptions);
    window.addEventListener("beforeunload", this.onbeforeunload);
    window.addEventListener("resize", this.updateLayout);
    window.addEventListener("resize", this.checkSize);
    this.joinSession();
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
    window.removeEventListener("resize", this.updateLayout);
    window.removeEventListener("resize", this.checkSize);
    this.leaveSession();
  }

  onbeforeunload(event) {
    this.leaveSession();
  }

  joinSession() {
    this.OV = new OpenVidu();

    this.setState(
      {
        session: this.OV.initSession(),
      },
      async () => {
        this.subscribeToStreamCreated();
        this.subscribeToEndSession();  // session이 초기화된 후에 호출
        
        this.subscribeToStreamDestroyed();
        this.subscribeToUserChanged();
        
        //this.subscribeToUserLeft();  // 사용자 퇴장 신호 구독
        await this.connectToSession();
      }
    );

    this.setupWebSocket();
  }

  // FastAPI 웹소켓부분
  setupWebSocket() {
    const websocketUrl =
      AI_SERVER_URL.startsWith("ws://") || AI_SERVER_URL.startsWith("wss://")
        ? AI_SERVER_URL
        : `ws://${AI_SERVER_URL}`;

    console.log("Connecting to WebSocket at:", websocketUrl);
    this.webSocket = new WebSocket(websocketUrl);

    this.webSocket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    this.webSocket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log("Received from server:", data);
      this.setState({ nsfwProb: data.nsfw_prob });
    };

    this.webSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.webSocket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }
  //

  async connectToSession() {
    if (this.props.token !== undefined) {
      console.log("token received: ", this.props.token);
      this.connect(this.props.token);
    } else {
      try {
        console.log(this.props.isHost + " : " + this.state.mySessionId)
        var token = await this.getToken(this.props.isHost, this.state.mySessionId);
        this.connect(token);
      } catch (error) {
        console.error("There was an error getting the token:", error.code, error.message);
        if (this.props.error) {
          this.props.error({
            error: error.error,
            message: error.message,
            code: error.code,
            status: error.status,
          });
        }
        alert("There was an error getting the token:", error.message);
      }
    }
  }

  connect(token) {
    console.log("token generated : ")
    console.log(token)
    console.log("myUserName!")
    console.log(this.state.myUserName)

    this.state.session
      .connect(token, { clientData: this.state.myUserName })
      .then(() => {
        this.connectWebCam();
      })
      .catch((error) => {
        if (this.props.error) {
          this.props.error({
            error: error.error,
            message: error.message,
            code: error.code,
            status: error.status,
          });
        }
        alert("There was an error connecting to the session:", error.message);
        console.log("There was an error connecting to the session:", error.code, error.message);
      });
  }

  async connectWebCam() {
    await this.OV.getUserMedia({ audioSource: undefined, videoSource: undefined });
    var devices = await this.OV.getDevices();
    var videoDevices = devices.filter((device) => device.kind === "videoinput");

    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const videoTrack = mediaStream.getVideoTracks()[0];

        if (!videoTrack) {
            console.error("No video track found");
            return;
        }

        console.log("MediaStream obtained: ", mediaStream);

        let publisher = this.OV.initPublisher(undefined, {
            videoSource: videoTrack,
            publishAudio: localUser.isAudioActive(),
            publishVideo: localUser.isVideoActive(),
            resolution: "640x480",
            frameRate: 15, // 프레임레이트 줄이기
            insertMode: "APPEND",
            mirror: false,
        });

        if (this.state.session.capabilities.publish) {
            publisher.on("accessAllowed", () => {
                console.log("Publisher access allowed");
                this.state.session.publish(publisher).then(() => {
                    console.log("Session published");
                    this.updateSubscribers();
                    this.localUserAccessAllowed = true;
                    if (this.props.joinSession) {
                        this.props.joinSession();
                    }
                });
            });
        }

        publisher.on("accessDenied", (error) => {
            console.error("Access denied: ", error);
        });

        localUser.setNickname(this.state.myUserName);
        localUser.setConnectionId(this.state.session.connection.connectionId);
        localUser.setScreenShareActive(false);
        localUser.setStreamManager(publisher);
        this.setState({ currentVideoDevice: videoTrack, localUser: localUser });

        const sendFrame = async () => {
            const imageCapture = new ImageCapture(videoTrack);
            try {
                const bitmap = await imageCapture.grabFrame();
                const canvas = document.createElement('canvas');
                canvas.width = bitmap.width;
                canvas.height = bitmap.height;
                const context = canvas.getContext('2d');
                context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
                canvas.toBlob(async (blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (this.webSocket.readyState === WebSocket.OPEN) {
                            console.log("Sending frame to server");
                            
                            // JSON 객체로 변환하여 frame 정보와 함께 전송
                            const message = {
                                session_id: this.state.mySessionId,
                                connection_id: this.state.session.connection.connectionId,
                                frame: reader.result.split(',')[1] // Base64 데이터만 전송
                            };
                            
                            this.webSocket.send(JSON.stringify(message));
                        }
                    };
                    reader.readAsDataURL(blob); // Blob을 Base64로 변환
                }, 'image/jpeg');
            } catch (error) {
                console.error("Error capturing frame:", error);
            }
        };
        
        // 프레임 전송 빈도 줄이기
        setInterval(sendFrame, 1000); // 1 FPS로 전송

    } catch (error) {
          console.error("Error accessing media devices.", error);
    }
  }

  updateSubscribers() {
    var subscribers = this.remotes;
    this.setState(
      {
        subscribers: subscribers,
      },
      () => {
        if (this.state.localUser) {
          this.sendSignalUserChanged({
            isAudioActive: this.state.localUser.isAudioActive(),
            isVideoActive: this.state.localUser.isVideoActive(),
            nickname: this.state.localUser.getNickname(),
            isScreenShareActive: this.state.localUser.isScreenShareActive(),
          });
        }
        this.updateLayout();
      }
    );
  }

  // 강사가 종료 시그널을 보내는 함수
  sendEndSessionSignal() {
    const signalOptions = {
        data: JSON.stringify({ endSession: true }),
        type: "endSession",  // 신호 유형 지정
    };
    this.state.session.signal(signalOptions);
  }
  // 수강생이 종료 시그널을 받도록 하는 함수
  subscribeToEndSession() {
    this.state.session.on("signal:endSession", (event) => {
      // 세션 종료 신호를 수신했을 때 동작
      console.log("Session 종료 신호를 수신했습니다:", event.data);
      
      this.state.session.disconnect();
      window.location.href = `/courseDetail/${this.props.course_id}`;
    });
  }
  
// 사용자가 세션을 떠났다는 신호를 보내는 메서드
sendSignalUserLeft() {
  const signalOptions = {
      data: JSON.stringify({ userLeft: this.state.myUserName }),
      type: "userLeft",
  };
  this.state.session.signal(signalOptions)
      .then(() => {
          console.log("User left signal sent successfully.");
      })
      .catch(error => {
          console.error("Error sending user left signal: ", error);
      });
  }
// 모든 사용자는 다른 사용자가 떠났다는 신호를 수신했을 때, 그 사용자를 화면에서 제거
subscribeToUserLeft() {
    this.state.session.on('signal:userLeft', (event) => {
        const data = JSON.parse(event.data);
        const username = data.userLeft;

        // 떠난 사용자를 subscribers에서 제거
        const updatedSubscribers = this.state.subscribers.filter(user => user.getNickname() !== username);

        this.setState({ subscribers: updatedSubscribers }, () => {
            console.log(username + " has left the session.");
            this.updateLayout();  // 레이아웃 갱신
        });
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////
  leaveSession() {
    const mySession = this.state.session;

    if (this.state.role === 'Instructor') {
      
      // 세션 종료 신호를 전송
      this.sendEndSessionSignal();

      this.fetchLeaveLiveSession(Number(this.props.course_id), this.props.curriculum_id);
    }
    
    if (mySession) {
      this.sendSignalUserLeft();
      mySession.disconnect();
      console.log("#########disconnect############")
    }

    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: "ClosedSession",
      myUserName: "OpenVidu_User" + Math.floor(Math.random() * 100),
      localUser: undefined,
    });
    if (this.props.leaveSession) {
      this.props.leaveSession();
    }

   // 모든 사용자(강사 포함)가 세션을 떠나 메인 페이지로 이동
   window.location.href = `/courseDetail/${this.props.course_id}`;
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////

  camStatusChanged() {
    localUser.setVideoActive(!localUser.isVideoActive());
    localUser.getStreamManager().publishVideo(localUser.isVideoActive());
    this.sendSignalUserChanged({ isVideoActive: localUser.isVideoActive() });
    this.setState({ localUser: localUser });
  }

  micStatusChanged() {
    localUser.setAudioActive(!localUser.isAudioActive());
    localUser.getStreamManager().publishAudio(localUser.isAudioActive());
    this.sendSignalUserChanged({ isAudioActive: localUser.isAudioActive() });
    this.setState({ localUser: localUser });
  }

  nicknameChanged(nickname) {
    let localUser = this.state.localUser;
    localUser.setNickname(nickname);
    this.setState({ localUser: localUser });
    this.sendSignalUserChanged({ nickname: this.state.localUser.getNickname() });
  }

  deleteSubscriber(stream) {
    const remoteUsers = this.state.subscribers;
    const userStream = remoteUsers.filter((user) => user.getStreamManager().stream === stream)[0];
    let index = remoteUsers.indexOf(userStream, 0);
    if (index > -1) {
      remoteUsers.splice(index, 1);
      this.setState({
        subscribers: remoteUsers,
      });
    }
  }

  subscribeToStreamCreated() {
    this.state.session.on("streamCreated", (event) => {
      if (event.stream.connection.connectionId !== this.state.session.connection.connectionId) {
        const subscriber = this.state.session.subscribe(event.stream, undefined);
        subscriber.on("streamPlaying", (e) => {
          this.checkSomeoneShareScreen();
          subscriber.videos[0].video.parentElement.classList.remove("custom-class");
        });
        const newUser = new UserModel();
        newUser.setStreamManager(subscriber);
        newUser.setConnectionId(event.stream.connection.connectionId);
        newUser.setType("remote");
        const nickname = event.stream.connection.data.split("%")[0];
        newUser.setNickname(JSON.parse(nickname).clientData);
        this.remotes.push(newUser);
        if (this.localUserAccessAllowed) {
          this.updateSubscribers();
        }
      }
    });
  }

  subscribeToStreamDestroyed() {
    this.state.session.on("streamDestroyed", (event) => {
      this.deleteSubscriber(event.stream);
      setTimeout(() => {
        this.checkSomeoneShareScreen();
      }, 20);
      event.preventDefault();
      this.updateLayout();
    });
  }

  subscribeToUserChanged() {
    this.state.session.on("signal:userChanged", (event) => {
      let remoteUsers = this.state.subscribers;
      remoteUsers.forEach((user) => {
        if (user.getConnectionId() === event.from.connectionId) {
          const data = JSON.parse(event.data);
          if (data.isAudioActive !== undefined) {
            user.setAudioActive(data.isAudioActive);
          }
          if (data.isVideoActive !== undefined) {
            user.setVideoActive(data.isVideoActive);
          }
          if (data.nickname !== undefined) {
            user.setNickname(data.nickname);
          }
          if (data.isScreenShareActive !== undefined) {
            user.setScreenShareActive(data.isScreenShareActive);
          }
        }
      });
      this.setState(
        {
          subscribers: remoteUsers,
        },
        () => this.checkSomeoneShareScreen()
      );
    });
  }

  updateLayout() {
    setTimeout(() => {
      this.layout.updateLayout();
    }, 20);
  }

  sendSignalUserChanged(data) {
    const signalOptions = {
      data: JSON.stringify(data),
      type: "userChanged",
    };
    this.state.session.signal(signalOptions);
  }

  toggleFullscreen() {
    const document = window.document;
    const fs = document.getElementById("container");
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (fs.requestFullscreen) {
        fs.requestFullscreen();
      } else if (fs.msRequestFullscreen) {
        fs.msRequestFullscreen();
      } else if (fs.mozRequestFullScreen) {
        fs.mozRequestFullScreen();
      } else if (fs.webkitRequestFullscreen) {
        fs.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  async switchCamera() {
    try {
      const devices = await this.OV.getDevices();
      var videoDevices = devices.filter((device) => device.kind === "videoinput");

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== this.state.currentVideoDevice.deviceId
        );
        const canvasStream = this.canvasRef.current.captureStream(30);

        if (newVideoDevice.length > 0) {
          var newPublisher = this.OV.initPublisher(undefined, {
            audioSource: undefined,
            videoSource: canvasStream.getVideoTracks()[0],
            publishAudio: localUser.isAudioActive(),
            publishVideo: localUser.isVideoActive(),
            mirror: false,
          });

          await this.state.session.unpublish(this.state.localUser.getStreamManager());
          await this.state.session.publish(newPublisher);
          this.state.localUser.setStreamManager(newPublisher);
          this.setState({
            currentVideoDevice: newVideoDevice,
            localUser: localUser,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  screenShare() {
    const videoSource = navigator.userAgent.indexOf("Firefox") !== -1 ? "window" : "screen";
    const publisher = this.OV.initPublisher(
      undefined,
      {
        videoSource: videoSource,
        publishAudio: localUser.isAudioActive(),
        publishVideo: localUser.isVideoActive(),
        mirror: false,
      },
      (error) => {
        if (error && error.name === "SCREEN_EXTENSION_NOT_INSTALLED") {
          this.setState({ showExtensionDialog: true });
        } else if (error && error.name === "SCREEN_SHARING_NOT_SUPPORTED") {
          alert("Your browser does not support screen sharing");
        } else if (error && error.name === "SCREEN_EXTENSION_DISABLED") {
          alert("You need to enable screen sharing extension");
        } else if (error && error.name === "SCREEN_CAPTURE_DENIED") {
          alert("You need to choose a window or application to share");
        }
      }
    );

    publisher.once("accessAllowed", () => {
      this.state.session.unpublish(localUser.getStreamManager());
      localUser.setStreamManager(publisher);
      this.state.session.publish(localUser.getStreamManager()).then(() => {
        localUser.setScreenShareActive(true);
        this.setState({ localUser: localUser }, () => {
          this.sendSignalUserChanged({ isScreenShareActive: localUser.isScreenShareActive() });
        });
      });
    });
    publisher.on("streamPlaying", () => {
      this.updateLayout();
      publisher.videos[0].video.parentElement.classList.remove("custom-class");
    });
  }

  closeDialogExtension() {
    this.setState({ showExtensionDialog: false });
  }

  stopScreenShare() {
    this.state.session.unpublish(localUser.getStreamManager());
    this.connectWebCam();
  }

  checkSomeoneShareScreen() {
    let isScreenShared;
    isScreenShared =
      this.state.subscribers.some((user) => user.isScreenShareActive()) ||
      localUser.isScreenShareActive();
    const openviduLayoutOptions = {
      maxRatio: 3 / 2,
      minRatio: 9 / 16,
      fixedRatio: isScreenShared,
      bigClass: "OV_big",
      bigPercentage: 0.8,
      bigFixedRatio: false,
      bigMaxRatio: 3 / 2,
      bigMinRatio: 9 / 16,
      bigFirst: true,
      animate: true,
    };
    this.layout.setLayoutOptions(openviduLayoutOptions);
    this.updateLayout();
  }

  toggleChat(property) {
    let display = property;

    if (display === undefined) {
      display = this.state.chatDisplay === "none" ? "block" : "none";
    }
    if (display === "block") {
      this.setState({ chatDisplay: display, messageReceived: false });
    } else {
      this.setState({ chatDisplay: display });
    }
    this.updateLayout();
  }

  checkNotification(event) {
    this.setState({
      messageReceived: this.state.chatDisplay === "none",
    });
  }

  checkSize() {
    if (document.getElementById("layout").offsetWidth <= 700 && !this.hasBeenUpdated) {
      this.toggleChat("none");
      this.hasBeenUpdated = true;
    }
    if (document.getElementById("layout").offsetWidth > 700 && this.hasBeenUpdated) {
      this.hasBeenUpdated = false;
    }
  }

  render() {
    const mySessionId = this.state.mySessionId;
    const localUser = this.state.localUser;
    var chatDisplay = { display: this.state.chatDisplay };

    return (
      <div className="container" id="container">
        <UserStoreWrapper onStoreData={this.handleStoreData} />
        <ToolbarComponent
          sessionId={mySessionId}
          user={localUser}
          showNotification={this.state.messageReceived}
          camStatusChanged={this.camStatusChanged}
          micStatusChanged={this.micStatusChanged}
          screenShare={this.screenShare}
          stopScreenShare={this.stopScreenShare}
          toggleFullscreen={this.toggleFullscreen}
          switchCamera={this.switchCamera}
          leaveSession={this.leaveSession}
          toggleChat={this.toggleChat}
        />

        <div id="layout" className="bounds">
          {localUser !== undefined && localUser.getStreamManager() !== undefined && (
            <div className="OT_root OT_publisher custom-class" id="localUser">
              <StreamComponent user={localUser} handleNickname={this.nicknameChanged} />
            </div>
          )}
          {this.state.subscribers.map((sub, i) => (
            <div key={i} className="OT_root OT_publisher custom-class" id="remoteUsers">
              <StreamComponent user={sub} streamId={sub.streamManager.stream.streamId} />
            </div>
          ))}
          {localUser !== undefined && localUser.getStreamManager() !== undefined && (
            <div className="OT_root OT_publisher custom-class" style={chatDisplay}>
              <ChatComponent
                user={localUser}
                chatDisplay={this.state.chatDisplay}
                close={this.toggleChat}
                messageReceived={this.checkNotification}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  async getToken(flag, sessionId) {
    if (!flag)
      return await this.fetchCreateToken(sessionId);
    else {
      let getSessionId = await this.fetchCreateSession(sessionId);
      return await this.fetchCreateToken(getSessionId);
    }
  }

  async fetchCreateSession(sessionId) {
    const response = await createSession(sessionId, this.props.memberId);
    return response.data;
  }

  async fetchCreateToken(sessionId) {
    const response = await createToken(sessionId);
    return response.data;
  }

  async fetchLeaveLiveSession(sessionId, curriculum_id) {
    const response = await leaveLiveSession(sessionId, curriculum_id);
    return response.data;
  }
}

export default useTest;
