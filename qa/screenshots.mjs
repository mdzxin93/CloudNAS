import { chromium } from 'playwright';
import fs from 'node:fs';
const out='E:/SAM/screenshots';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
try {
 await page.goto('http://localhost:5173/',{waitUntil:'networkidle'});
 await page.getByLabel('Email address').fill('sam.qa.20261114@example.test');
 await page.getByLabel('Password').fill('Sam-QA-Password-2026!');
 await page.getByRole('button',{name:'Sign in'}).click();
 await page.getByText('Good to see you, SAM').waitFor();
 await page.waitForTimeout(500);
 await page.screenshot({path:out+'/02-dashboard-desktop.png'});
 const desktop=await page.locator('.sidebar').evaluate(el=>({className:el.className,width:el.getBoundingClientRect().width}));
 await page.locator('.sidebar .nav-item').filter({hasText:'My Files'}).click();
 await page.getByRole('heading',{name:'My Files'}).waitFor();
 await page.waitForTimeout(300);
 await page.screenshot({path:out+'/03-files-desktop.png'});
 await page.setViewportSize({width:390,height:844});
 await page.waitForTimeout(300);
 const mobile=await page.locator('.sidebar').evaluate(el=>({className:el.className,width:el.getBoundingClientRect().width,transform:getComputedStyle(el).transform,documentWidth:document.documentElement.scrollWidth}));
 await page.screenshot({path:out+'/05-files-mobile.png'});
 await page.locator('.bottom-nav button').filter({hasText:'Home'}).click();
 await page.getByText('Good to see you, SAM').waitFor();
 await page.waitForTimeout(300);
 await page.screenshot({path:out+'/04-dashboard-mobile.png'});
 console.log(JSON.stringify({desktop,mobile,errors},null,2));
} catch(e) {console.log(JSON.stringify({error:e.message,errors},null,2));process.exitCode=1}
finally {await browser.close()}
