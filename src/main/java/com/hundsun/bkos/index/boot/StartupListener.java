package com.hundsun.bkos.index.boot;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.hundsun.bkos.auth.WebNoRightHandler;
import com.hundsun.bkos.monitor.MonitorPoolManager;
import com.hundsun.bkos.permission.interceptor.AuthHandlerManager;
import com.hundsun.bkos.permission.util.WhiteListUtil;

public class StartupListener implements ServletContextListener {

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		//注册用户权限验证处理器
		AuthHandlerManager.registerAuthHandler(new WebNoRightHandler());
		
		WhiteListUtil.addNoRightAct("/publogin.htm");
		WhiteListUtil.addNoRightAct("/loginCheck.json");// 登录验证
		WhiteListUtil.addNoRightAct("/loginOut.htm");// 登录验证		
		WhiteListUtil.addNoRightAct("/checkBrowserVersion.htm");// 浏览器版本检查
			
		WhiteListUtil.addNoRightAct("/common/dictionary/loadDict.json");
				
		WhiteListUtil.addNoRightAct("/official/officialsend/officialInfo.htm");//公众号网页
		WhiteListUtil.addNoRightAct("/official/officialsend/getOfficialImg.json");//公众号图片
		WhiteListUtil.addNoRightAct("/official/officialsend/getOfficialBody.json");//公众号消息体
		// 权限工具
        // WhiteListUtil.addNoRightAct("/module/moduleExport.htm");
        // WhiteListUtil.addNoRightAct("/module/getModuleList.json");
        // WhiteListUtil.addNoRightAct("/module/getModuleRoleList.json");
        // WhiteListUtil.addNoRightAct("/module/export.json");
        // WhiteListUtil.addNoRightAct("/module/exportSql.json");
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		MonitorPoolManager.getInstacne().shutdown();
		System.out.println("MonitorPoolManager.getInstacne().shutdown()");
	}

}
