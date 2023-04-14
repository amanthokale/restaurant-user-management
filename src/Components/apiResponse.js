exports.successResponse = function (response, msg) {
  const data = {
    status: 1,
    message: msg,
  };
  return response.send(200).json(data);
};

exports.successResponseWithData = function (response, msg, data) {
  const data = {
    status: 1,
    message: msg,
    data: data,
  };
  return response.send(200).json(data);
};

exports.errorResponse = function (response, msg) {
  const data = {
    status: 0,
    message: msg,
  };
  return response.send(500).json(data);
};

exports.validationErrorWithData = function (response, msg, data) {
  const data = {
    status: 0,
    message: msg,
    error: data,
  };
  return response.send(400).json(data);
};

exports.unauthorizedResponse = function (response, msg) {
  const data = {
    status: 0,
    message: msg,
    data: "",
  };
  return response.send(401).json(data);
};

exports.forbiddenResponse = function (response, msg) {
  const data = {
    status: 0,
    message: msg,
  };
  return response.send(403).json(data);
};

exports.unauthorizedResponse = function (response, msg) {
  const data = {
    status: 0,
    message: msg,
  };
  return response.send(501).json(data);
};
