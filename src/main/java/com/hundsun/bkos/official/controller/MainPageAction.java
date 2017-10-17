package com.hundsun.bkos.official.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.hundsun.bkos.common.controller.BaseAction;
import com.hundsun.bkos.permission.annotation.Operation;

@Controller
@RequestMapping("/official/mainpage")
public class MainPageAction extends BaseAction {
    @RequestMapping("/mainpage.htm")
    @Operation(index = 110, roles = "7", code = "mainpage", name = "主页界面", desc = "主页界面")
    public void list(HttpServletRequest request, ModelMap model) {

    }
}
