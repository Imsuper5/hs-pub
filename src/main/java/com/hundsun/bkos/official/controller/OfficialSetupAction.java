package com.hundsun.bkos.official.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.hundsun.bkos.common.controller.BaseAction;
import com.hundsun.bkos.common.dto.OfficialAccountDTO;
import com.hundsun.bkos.common.dto.page.OfficialAccountPageDTO;
import com.hundsun.bkos.common.interfaces.IPublicShareService;
import com.hundsun.bkos.common.query.OfficialAccountQuery;
import com.hundsun.bkos.permission.annotation.Operation;
import com.hundsun.bkos.permission.dto.UserTokenDTO;

@Controller
@RequestMapping("/official/officialSetup")
public class OfficialSetupAction extends BaseAction {

	  @Autowired
	    private IPublicShareService shareService;
	
	@RequestMapping("/officialSetup.htm")
	@Operation(index = 50, roles = "7", code = "officialSetup", name = "公众号个人设置", desc = "公众号个人设置")
	public void list(HttpServletRequest request, ModelMap model) {
		UserTokenDTO token = getUserToken(request);
		OfficialAccountQuery qry = new OfficialAccountQuery();
		qry.setOffaccNo(token.getUserNo());
		OfficialAccountPageDTO page = shareService.getOfficialList(qry);
		if (page.getRowCount() == 1) {
			OfficialAccountDTO acc = page.getRows().get(0);
			model.addAttribute("accountInfo", acc);
		}
	}
}
