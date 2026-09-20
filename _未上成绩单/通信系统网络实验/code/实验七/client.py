import cv2
import numpy as np
import socket
import time

# 配置参数
SERVER_IP = '192.168.1.100'   # 边缘服务器的IP地址
SERVER_PORT = 8888            # 边缘服务器的UDP端口
GROUP_NUM = 7                 # 组号
SEND_INTERVAL = 2             # 抽帧数

def main():
    # 创建UDP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.settimeout(1.0)      # 设置接收超时，避免无限阻塞

    # 打开默认摄像头
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("无法打开摄像头")
        return

    frame_count = 0
    print("车辆端已启动，按 'q' 键退出...")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("读取帧失败")
            break

        #窗口1：原视频 
        original = frame.copy()
        cv2.putText(original, f"Group {GROUP_NUM}", (30, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
        cv2.imshow("1 - Original Video", original)

        #窗口2：缩放+灰度图
        resized = cv2.resize(frame, (400, 300))
        gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
        cv2.imshow("2 - Gray 400x300", gray)

        # 每两帧采样一帧发送
        if frame_count % SEND_INTERVAL == 0:
            # 编码为JPEG字节流
            ret_encode, buf = cv2.imencode('.jpg', gray, [cv2.IMWRITE_JPEG_QUALITY, 90])
            if ret_encode:
                data = buf.tobytes()
                try:
                    # 发送到边缘服务器
                    sock.sendto(data, (SERVER_IP, SERVER_PORT))
                    # 接收服务器返回的差分图像
                    recv_data, _ = sock.recvfrom(65507)   # UDP最大长度
                    # 解码差分图像
                    np_arr = np.frombuffer(recv_data, dtype=np.uint8)
                    diff_img = cv2.imdecode(np_arr, cv2.IMREAD_GRAYSCALE)
                    if diff_img is not None:
                        cv2.imshow("3 - Frame Difference from Server", diff_img)
                except socket.timeout:
                    print("接收服务器响应超时")
                except Exception as e:
                    print(f"通信错误: {e}")

        frame_count += 1

        # 按 'q' 退出
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    sock.close()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()