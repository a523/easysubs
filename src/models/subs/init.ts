import { $rawSubs, fetchSubsFx } from ".";

// import { fetchSubsFx, $rawSubs } from ".";
$rawSubs.on(fetchSubsFx.doneData, (_, subs) => subs);
