---
title: 数位dp学习总结「模板」
date: 2016-10-19 18:57:41
tags:
  - DP
  - 学习笔记
categories:
  - oi
  - 学习笔记
---
数位dp模板，记忆化搜索，dp[pos][pre][status]。
以[不要62【hdu】](http://acm.hdu.edu.cn/showproblem.php?pid=2089)为例
<!-- more -->
``` cpp
#include <bits/stdc++.h>

using namespace std;

int dp[10][10][2], digits[10];
/**
 *@pos 当前处理的位置(一般从高位到低位)
 *@pre 上一个位的数字(更高的那一位)
 *@status 要达到的状态,如果为1则可以认为找到了答案,用来返回,给计数器+1
 *@limit 是否受限,也即当前处理这位能否随便取值
 */
int dfs(int pos, int pre, int status, int limit) {
	/*已搜到尽头,返回"是否找到了答案"这个状态*/
    if(pos < 1) return status;
    /*dp里保存的是完整的,也即不受限的答案,所以如果满足的话,可以直接返回*/
    if(!limit && dp[pos][pre][status] != -1)
        return dp[pos][pre][status];
    register int end = limit ? digits[pos] : 9, ret = 0;
    /*不要62*/
    for(register int i = 0; i <= end; i++)
        ret += dfs(pos - 1, i, status || (pre == 6 && i == 2) || i == 4, limit && (i == end));
    /*DP里保存完整的,取到尽头的数据*/
    if(!limit)
        dp[pos][pre][status] = ret;

    return ret;
}
/*从高位往低位dp*/
inline int solve(int x) {
	register int len = 0;
	while(x) {
		digits[++len] = x % 10;
		x /= 10;
	}
	return dfs(len, 0, 0, 1);
}

int main(int argc, char const *argv[]) {
	ios::sync_with_stdio(false);
	cin.tie(NULL);
	memset(dp, -1, sizeof(dp));
	int a, b;
	cin >> a >> b;
	register int ans = solve(b);
	memset(dp, -1, sizeof(dp));
	cout << b - (ans - solve(a - 1)) - a + 1;
	return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=22772576&auto=1&height=66"></iframe>