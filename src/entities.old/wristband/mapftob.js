function mapftob(wristband = {}) {
  return {
    wristbandNumber: wristband.id ?? null,
    wristbandColor: wristband.color ?? null,
    active: wristband.inState("paired"),
  };
}

export { mapftob };
