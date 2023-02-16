import { useState, useEffect } from "react";
import useFetch from "./useFetch";

export default seasonId => {
  const [rules, setRules] = useState(undefined);
  const { response } = useFetch(`/api/seasons/rules/${seasonId}`, undefined);

  useEffect(() => {
    if (response) {
      setRules(response);
    } else {
      setRules(undefined);
    }
  }, [response]);
  return rules;
};
