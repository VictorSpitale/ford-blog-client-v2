import {NextRouter} from "next/router";

export function MatchPush(router: NextRouter, url: string) {
    expect(router.push).toHaveBeenCalledWith(url, url, expect.anything());
}