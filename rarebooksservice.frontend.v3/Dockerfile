# ���� 1: ������ React-����������
FROM node:18-alpine AS build
WORKDIR /app

# �������� package.json � package-lock.json � ������������� �����������
COPY package*.json ./
RUN npm install

# �������� ���� ��� � ������� ���������� ����������
COPY . .

# ������ ����������
RUN npm run build

# ���� 2: ��������� Nginx ��� ������������ ����������� ������
FROM nginx:stable-alpine

# �������� ��������� ����� React-���������� �� ����� ������ � Nginx
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# ��������� ���� 80 ��� ������� � ����������
EXPOSE 3000

# ��������� Nginx
CMD ["nginx", "-g", "daemon off;"]
