package com.hundsun.bkos.official.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hundsun.bkos.base.MessageDTO;
import com.hundsun.bkos.base.PageDTO;
import com.hundsun.bkos.common.controller.BaseAction;
import com.hundsun.bkos.common.dto.UserSysDTO;
import com.hundsun.bkos.common.interfaces.IPublicShareService;
import com.hundsun.bkos.common.query.OfficialAccountQuery;
import com.hundsun.bkos.common.query.UserOnlyQuery;
import com.hundsun.bkos.common.services.RestApiService;
import com.hundsun.bkos.permission.annotation.Operation;
import com.hundsun.bkos.permission.dto.UserTokenDTO;
import com.restapi.j2sdk.entity.OfficialAccountSubscibeEntites;
import com.restapi.j2sdk.entity.OfficialAccountSubscibeEntity;

@Controller
@RequestMapping("/official/officialUsers")
public class OfficialUsersAction extends BaseAction {
    @Autowired
    private RestApiService restApiService;
    @Autowired
    private IPublicShareService shareService;


    @RequestMapping("/officialUsers.htm")
    @Operation(index = 80, roles = "7", code = "officialUsers", name = "关注着用户界面", desc = "关注着用户界面")
    public void list(HttpServletRequest request, ModelMap model) {
        // 布局明细
        setGridField("gridoffUsers", 7, "list_offUsers", model, request);

        UserTokenDTO token = getUserToken(request);
        request.setAttribute("userIm", token.getUserNo());
    }

    @RequestMapping("/getOfficialUsersList.json")
    @ResponseBody
    @Operation(index = 81, roles = "7", code = "getOfficialUsersList", name = "关注着用户列表", desc = "关注着用户类表")
    public PageDTO<UserSysDTO> getOfficialList(OfficialAccountQuery query) {
        PageDTO<UserSysDTO> pubPageDTO = new PageDTO<UserSysDTO>();
        List<UserSysDTO> newlist = new ArrayList<>();
        MessageDTO message = new MessageDTO();
        OfficialAccountSubscibeEntites entites = restApiService.getOfficialAccountSubscibe(query);
        if (entites != null) {
            List<OfficialAccountSubscibeEntity> list = entites.getList();
            message.setSuccess(true);
            if (list != null && list.size() > 0) {
                for (int i = query.getStartRow(); i < list.size(); i++) {
                    OfficialAccountSubscibeEntity item = list.get(i);
                    UserOnlyQuery qry = new UserOnlyQuery();
                    qry.setUserNo(item.getUsername());
                    UserSysDTO model = shareService.getUserByOnly(qry);
                    if (!qry.getUserNo().equals(model.getUserNo())) {
                        break;
                    }
                    newlist.add(model);
                }
            }
        }
        pubPageDTO.setRows(newlist);
        pubPageDTO.setRowCount(entites.getCount());
        pubPageDTO.setMessage(message);
        return pubPageDTO;
    }
}
