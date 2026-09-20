import cv2
import numpy as np
import socket

# 配置参数
HOST = '0.0.0.0'      # 监听所有网络接口
PORT = 8888           # 端口

def main():
    # 创建UDP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind((HOST, PORT))
    print(f"边缘服务器已启动，监听 {HOST}:{PORT}")

    previous_frame = None   # 上一帧灰度图

    while True:
        try:
            # 接收数据（最大65507字节）这里是UDP协议的最大字节数
            data, client_addr = sock.recvfrom(65507)
            # 解码为灰度图
            np_arr = np.frombuffer(data, dtype=np.uint8)
            current_frame = cv2.imdecode(np_arr, cv2.IMREAD_GRAYSCALE)
            if current_frame is None:
                print("解码失败，跳过")
                continue

            # 计算差分图像
            if previous_frame is not None:
                diff = cv2.absdiff(current_frame, previous_frame)
            else:
                # 第一帧：返回全黑图像
                diff = np.zeros_like(current_frame, dtype=np.uint8)

            # 将差分图像编码为JPEG并发送回客户端
            ret_encode, buf = cv2.imencode('.jpg', diff, [cv2.IMWRITE_JPEG_QUALITY, 80])
            if ret_encode:
                sock.sendto(buf.tobytes(), client_addr)

            # 更新上一帧
            previous_frame = current_frame

        except KeyboardInterrupt:
            print("\n服务器关闭")
            break
        except Exception as e:
            print(f"处理异常: {e}")

    sock.close()

if __name__ == "__main__":
    main()