package com.hundsun.bkos.official.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hundsun.bkos.base.MessageDTO;
import com.hundsun.bkos.common.controller.BaseAction;
import com.hundsun.bkos.official.interfaces.IOfficialService;
import com.hundsun.bkos.official.query.OfficialAccountMsgQuery;
import com.hundsun.bkos.permission.annotation.Operation;

@Controller
@RequestMapping("/official/officialInformation")
public class OfficialInformationAction extends BaseAction {
	@Autowired
	private IOfficialService officialService;

	@RequestMapping("/officialInformation.htm")
	@Operation(index = 20, roles = "7", code = "officialInformation", name = "已发消息界面", desc = "已发消息界面")
	public void list(HttpServletRequest request, ModelMap model) {
		// 布局明细
		setGridField("gridoffInfo", 63, "list_offInfo", model, request);
		
	}
	@RequestMapping("/deleteOfficialMsg.json")
	@ResponseBody
	@Operation(index = 21, roles = "7", code = "deleteOfficialMsg", name = "删除已发消息", desc = "删除已发消息")
	public MessageDTO deleteOfficialMsg(OfficialAccountMsgQuery query){
		MessageDTO message=new MessageDTO();
		message.setSuccess(true);
		officialService.delOfficialMsg(query);
		return message;
	}
}
