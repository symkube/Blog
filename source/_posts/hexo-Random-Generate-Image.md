---
title: 为hexo首页随机生成配图
date: 2016-07-28 22:55:28
tags:
  - HTML
  - Java
categories:
  - Java
---
## 为hexo首页随机生成配图
### 美化边框模板
``` html
<img src="" style="float:left;margin-right:10px;margin-top:10px;margin-bottom:10px;-webkit-box-shadow:0 0 10px rgba(0, 204, 204, .5);  
  -moz-box-shadow:0 0 10px rgba(0, 204, 204, .5);  
  box-shadow:0 0 10px rgba(0, 204, 204, .5);width:240px;height:180px;">
```
### Java实现对html代码的替换
<!-- more -->
``` java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.util.concurrent.ThreadLocalRandom;

public class Main {
    public static final String PART_ONE = "<img src=\"http://oi.xehoth.cc/images/";
    public static final String PART_TWO = ".jpg\" style=\"float:left;margin-right:10px;margin-top:10px;margin-bottom:10px;\r\n"
            + "-webkit-box-shadow:0 0 10px rgba(0, 204, 204, .5);\r\n"
            + "-moz-box-shadow:0 0 10px rgba(0, 204, 204, .5);\r\n"
            + "box-shadow:0 0 10px rgba(0, 204, 204, .5);width:240px;height:180px;\">\r\n";
    public static final String MAIN_PATH = "C:\\Users\\pc\\Desktop\\public\\";
    public static final int ARTICLE_NUM = 53;
    public static final int IMAGE_NUM = 53;
    public static StringBuilder sb;
    public static String content;

    public static void main(String[] args) {
        int n = (int) Math.ceil((double) ARTICLE_NUM / 9);
        int pos = ARTICLE_NUM;
        try {
            File file = new File(MAIN_PATH + "index.html");
            open(file);
            change(pos, file);
            pos -= 9;
            for (int i = 2; i <= n; i++) {
                File file1 = new File(MAIN_PATH + "page\\" + i + "\\index.html");
                open(file1);
                change(pos, file1);
                pos -= 9;
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public static void change(int num, File file) throws IOException {
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), "UTF-8"), 100000);
        int l_pos = 0, n_pos = content.indexOf("<div class=\"post-body\"");
        while (n_pos != -1) {
            bw.write(content.substring(l_pos, n_pos));
            bw.write(PART_ONE + Integer.toString(ThreadLocalRandom.current().nextInt(1, IMAGE_NUM)) + PART_TWO);
            System.out.println(num);
            num--;
            l_pos = n_pos;
            n_pos = content.indexOf("<div class=\"post-body\"", n_pos + 1);
        }
        bw.write(content.substring(l_pos, content.length()));
        bw.flush();
        bw.close();
    }

    public static void open(File file) throws FileNotFoundException {
        try {
            sb = new StringBuilder();
            BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF-8"));
            String str;
            while ((str = br.readLine()) != null)
                sb.append(str + "\r\n");
            content = sb.toString();
            br.close();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
```
