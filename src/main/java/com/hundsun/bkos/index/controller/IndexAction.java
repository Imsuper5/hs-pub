package com.hundsun.bkos.index.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.alibaba.fastjson.JSON;
import com.hundsun.bkos.common.controller.BaseAction;
import com.hundsun.bkos.common.util.PubMethods;
import com.hundsun.bkos.permission.annotation.Module;
import com.hundsun.bkos.permission.annotation.Operation;
import com.hundsun.bkos.permission.dto.UserTokenDTO;
import com.hundsun.bkos.permission.services.RoleMenuCache;
import com.hundsun.bkos.permission.typedefine.SystemType;

@Controller
@RequestMapping("")
@Module(name="首页",desc="")
public class IndexAction extends BaseAction {
	@Autowired
	private RoleMenuCache roleMenu;
	

	
	@RequestMapping("/index3.htm")
	@Operation(index = 1, roles = "7", code = "index", name = "公众号系统首页", desc = "公众号系统首页")
	public void index3(HttpServletRequest request, ModelMap model) {
		LoadParam(request, model, SystemType.SYS_OFFICIAL.getValue());
	}

	private void LoadParam(HttpServletRequest request, ModelMap model, Integer sysType) {
		UserTokenDTO userTokenDto = getUserToken(request);
		if (userTokenDto != null) {
			//如果是公众号角色访问询报价系统,将角色设置为游客
			if(sysType == 2 && (null == userTokenDto.getRoleId() ||userTokenDto.getRoleId() == 7)){
				userTokenDto.setRoleId(4);
			}
			model.addAttribute("userRealName", userTokenDto.getUserRealName());
			model.addAttribute("roleId", userTokenDto.getRoleId());
			userTokenDto.setType(sysType);
		}
		// 加载菜单
		
		String appServer = PubMethods.getUrlBorker(request);
		String menus = roleMenu.getMenus(userTokenDto.getRoleId(),
				userTokenDto.getRoleIdList())
				.replace("${appServer}", appServer);
		Object json = JSON.parse(menus);
		request.setAttribute("menus", json);
	}
}
