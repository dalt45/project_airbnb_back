FROM node
WORKDIR /app
COPY app/package.json /app/package.json
RUN npm install
COPY app /app
<<<<<<< HEAD
CMD npm start
=======
CMD npm start
>>>>>>> 7243084647b1005e67179af474bf3883b0421b2f
