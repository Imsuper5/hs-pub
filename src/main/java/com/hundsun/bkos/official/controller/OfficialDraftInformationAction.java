package com.hundsun.bkos.official.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.hundsun.bkos.common.controller.BaseAction;
import com.hundsun.bkos.permission.annotation.Operation;
import com.hundsun.bkos.permission.dto.UserTokenDTO;

@Controller
@RequestMapping("/official/officialDraftInformation")
public class OfficialDraftInformationAction extends BaseAction {

    @Value("${openfire.server}")
    private String openfireServer;

    @RequestMapping("/officialDraftInformation.htm")
    @Operation(index = 10, roles = "7", code = "officialDraftInformation", name = "草稿消息界面", desc = "草稿消息界面")
    public void list(HttpServletRequest request, ModelMap model) {
        // 布局明细
        setGridField("gridoffInfo", 63, "list_offInfo", model, request);
        UserTokenDTO token = getUserToken(request);
        request.setAttribute("userIm", token.getUserNo());
        request.setAttribute("openfireServer", openfireServer);
    }
}
