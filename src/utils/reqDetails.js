import DeviceDetector from "node-device-detector";

export const getReqDetails = (req) => {
  const deviceDetector = new DeviceDetector();
  const device = deviceDetector.detect(req.headers["user-agent"]);
  return device;
};
