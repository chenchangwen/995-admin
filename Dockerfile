# 选择之前下载的node基础镜像 node:<version>
FROM node:12.4.0-alpine
#将当前文件夹下所有文件加入需要制作的镜像中, 在 'manage' 文件夹中.
ADD . /app
#  下载所需要的包
WORKDIR /app
#RUN npm install cnpm -g
#RUN npm install cnpm --registry=https://registry.npm.taobao.org
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install
# 定义程序默认端口
EXPOSE 9280
# 运行程序命令(manage是ADD添加的文件夹名称, server.js是自己的程序启动入口文件)
CMD ["npm","run","dev"]
# docker build -t 995:v0.2 .
# 切换到中国镜像
# vi /etc/docker/daemon.json
#{
#    "registry-mirrors": ["http://hub-mirror.c.163.com"]
#}
#systemctl restart docker.service

# docker run -d -p 9280:9280 995:v0.2

## 手工导出倒入镜像到服务器
# docker save -o 995v0.2.tar 995:v0.2

# yum install docker.x86_64
# service docker start
# docker load -i 995v0.2.tar
# systemctl start docker
# docker run 995v0.2
