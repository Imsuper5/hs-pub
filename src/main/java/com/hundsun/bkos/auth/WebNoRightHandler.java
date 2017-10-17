package com.hundsun.bkos.auth;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.alibaba.fastjson.JSONArray;
import com.hundsun.bkos.base.MessageExDTO;
import com.hundsun.bkos.permission.dto.UserTokenDTO;
import com.hundsun.bkos.permission.interceptor.authhandler.INoRightHandler;
import com.hundsun.bkos.permission.services.OnlineUser;
import com.hundsun.bkos.permission.typedefine.SystemType;
import com.hundsun.bkos.util.CookiesUtil;

public class WebNoRightHandler implements INoRightHandler{
	@Override
	public boolean doHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {	
		UserTokenDTO userTokenDto = OnlineUser.getOnlineUserToken(request.getSession().getId());
		Integer sysType = SystemType.SYS_QUOTE.getValue();		
		String servletPath = request.getServletPath();
		//判断是否为公众号系统的url
		if (SysRightUrlMap.getInstance().check(servletPath)) {
			sysType = SystemType.SYS_OFFICIAL.getValue();
		}
		CookiesUtil.setCookie(request, response, "moduleType", sysType.toString(), 0);
		
		// 如果是ajax请求响应头会有，x-requested-with,如果是ajaxfileipload 则request其是MultipartHttpServletRequest的实例
		if ((request.getHeader("x-requested-with") != null
				&& request.getHeader("x-requested-with")
						.equalsIgnoreCase("XMLHttpRequest")) || request instanceof MultipartHttpServletRequest) {
			MessageExDTO ex = new MessageExDTO();
			ex.setMessageCode(MessageExDTO.MSG_CODE_NOLOGIN);
			ex.setSuccess(false);
			ex.setMessage("未登录或者登录已超时，请重新登录");
			ex.setData("/publogin.htm");
			response.getOutputStream().write(
					JSONArray.toJSONString(ex).getBytes("utf-8"));
			return false;
		}
		else if (userTokenDto != null && userTokenDto.getUserId() != -1) {
			if(servletPath.contains("index3")){
				request.getRequestDispatcher("/publogin.htm")
				.forward(request, response);
			}else{
				request.getRequestDispatcher("/WEB-INF/views/screen/error.html")
				.forward(request, response);
			}
			
			return false;
		}
		
		request.getRequestDispatcher("/WEB-INF/views/screen/nologin.html").forward(request, response);
		return false;
	}

}
