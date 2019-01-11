import {VolTask} from "../../db/vol";
import { launch, getVolPageTasks } from './task';
import * as R from "ramda";

async function getLatestVol(): Promise<number> {
    const tasks: VolTask[] = await getVolPageTasks(1);
    return R.head(tasks).vol;
}

export {
    launch
}
