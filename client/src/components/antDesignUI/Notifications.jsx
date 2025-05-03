const [api, contextHolder] = notification.useNotification();

const openNotification = ({ message, description }) => {
  api.open({
    message: message,
    description: description,
    duration: 1,
  });
};

export default openNotification;
