function boot(backend) {
  return ({ deviceId, roomName, deviceType }) =>
    backend.publish("/boot", {
      deviceId,
      roomName,
      deviceType,
    });
}

export { boot };
