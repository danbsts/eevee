import React, { useEffect, useState } from "react";
import Text from "./Text";

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000);
  }, [time]);

  return <Text style={{ margin: 0 }} text={time.toString()} />;
}

export default Clock;
