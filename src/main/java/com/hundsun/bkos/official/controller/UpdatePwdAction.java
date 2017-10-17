package com.hundsun.bkos.official.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.hundsun.bkos.common.controller.BaseAction;
import com.hundsun.bkos.permission.annotation.Operation;
@Controller
@RequestMapping("/personalmanagement/pwdreset")
public class UpdatePwdAction extends BaseAction {
    @RequestMapping("/pwdreset.htm")
    @Operation(index = 120, roles = "7", code = "pwdreset", name = "修改密码界面", desc = "修改密码界面")
    public void list(HttpServletRequest request, ModelMap model) {
    
    }
}
