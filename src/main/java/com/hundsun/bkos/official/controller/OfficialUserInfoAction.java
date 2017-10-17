package com.hundsun.bkos.official.controller;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hundsun.bkos.base.MessageDTO;
import com.hundsun.bkos.base.PageDTO;
import com.hundsun.bkos.common.controller.BaseAction;
import com.hundsun.bkos.common.dto.AdjunctDTO;
import com.hundsun.bkos.common.dto.UserSysDTO;
import com.hundsun.bkos.common.interfaces.IPublicShareService;
import com.hundsun.bkos.common.query.AdjunctQuery;
import com.hundsun.bkos.common.query.OfficialUserInfoQuery;
import com.hundsun.bkos.common.query.UserOnlyQuery;
import com.hundsun.bkos.common.services.RestApiService;
import com.hundsun.bkos.official.dto.OfficialUserInfoDTO;
import com.hundsun.bkos.official.utils.OkHttpUtils;
import com.hundsun.bkos.permission.annotation.Operation;
import com.hundsun.bkos.permission.dto.UserTokenDTO;
import com.restapi.j2sdk.entity.OASubscriberMessageEntities;
import com.restapi.j2sdk.entity.OASubscriberMessageEntity;

@Controller
@RequestMapping("/official/userinfo")
public class OfficialUserInfoAction extends BaseAction {

    @Autowired
    private RestApiService reatapi;
    @Autowired
    private IPublicShareService shareService;



    @RequestMapping("/userinfo.htm")
    @Operation(index = 70, roles = "7", code = "userinfo", name = "关注着消息界面", desc = "关注着消息界面")
    public void list(HttpServletRequest request, ModelMap model) {
        setGridField("gridBoxuserinfo", 73, "list_userinfo", model, request);
        UserTokenDTO token = getUserToken(request);
        request.setAttribute("userIm", token.getUserNo());
    }

    @RequestMapping("/userinfolist.json")
    @ResponseBody
    @Operation(index = 71, roles = "7", code = "userinfolist", name = "关注着消息列表", desc = "关注着消息列表")
    public PageDTO<OfficialUserInfoDTO> getUserInfoList(HttpServletRequest request,
            OfficialUserInfoQuery query) {
        PageDTO<OfficialUserInfoDTO> pageDTO = new PageDTO<OfficialUserInfoDTO>();
        MessageDTO message = new MessageDTO();
        message.setSuccess(true);
        UserTokenDTO token = getUserToken(request);
        query.setToId(token.getUserNo());
        Date enddate = new Date();
        Date startdate = addDay(enddate, -query.getDay());
        query.setStartDate(startdate.getTime());
        query.setEndDate(enddate.getTime());
        List<OfficialUserInfoDTO> list = new ArrayList<>();
        List<OASubscriberMessageEntity> OAlist = new ArrayList<>();
        OASubscriberMessageEntities OAlists = reatapi.getOASubscriberMessages(query);
        if (OAlists != null) OAlist = OAlists.getList();
        if (OAlist != null) {
            for (int i = query.getStartRow(); i < OAlist.size(); i++) {
                OASubscriberMessageEntity item = OAlist.get(i);
                OfficialUserInfoDTO mode = new OfficialUserInfoDTO();
                mode.setBody(item.getBody());
                SimpleDateFormat dft = new SimpleDateFormat("yyyyMMddHHmmss");
                mode.setPubDate(dft.format(item.getPubDate()));
                // 查询个人信息
                UserOnlyQuery qry = new UserOnlyQuery();
                qry.setUserNo(item.getFromId());
                UserSysDTO sysdto = shareService.getUserByOnly(qry);
                if (!qry.getUserNo().equals(sysdto.getUserNo())) {
                    break;
                }
                mode.setName(sysdto.getUserRealName());
                mode.setCompany(sysdto.getUserCompany());
                String img =
                        "<img alt=\"image\"  style=\"width: 44px;\" src=\"../../personalinfo/userCheck/userApplyAdjunct.json?userId="
                                + sysdto.getUserId() + "&amp;adjuncdType=0\">";
                mode.setAvatar(img);
                list.add(mode);
            }
        }
        pageDTO.setRowCount(OAlists.getCount());
        pageDTO.setRows(list);
        pageDTO.setMessage(message);
        return pageDTO;
    }

    public Date addDay(Date date, int num) {
        Calendar startDT = Calendar.getInstance();
        startDT.setTime(date);
        startDT.add(Calendar.DAY_OF_MONTH, num);
        return startDT.getTime();
    }

    @RequestMapping("/officialAdjunct.json")
    @ResponseBody
    @Operation(index = 72, roles = "7", code = "officialAdjunct", name = "获取公众号用户头像", desc = "获取公众号用户头像")
    public void userApplyAdjunct(HttpServletRequest request, HttpServletResponse response,
            AdjunctQuery query) throws IOException {
        UserTokenDTO userToken = getUserToken(request);
        if (userToken != null) {
            query.setOfficialAccountId(userToken.getUserId());
        }
        List<AdjunctDTO> list = shareService.officialApplyAdjunct(query);

        if (list != null && list.size() > 0) {
            AdjunctDTO item = list.get(0);
            String uuid = item.getAdjuncdSuffix();
            byte[] b = item.getAdjuncdData();
            if (b.length < 200 && StringUtils.isNotBlank(uuid)) {
                b = OkHttpUtils.multiPartFormDataDown(uuid);
            }
            OutputStream toClient;
            response.setContentType("image/jpeg");
            toClient = response.getOutputStream();
            // 输出数据
            toClient.write(b);
            toClient.flush();
            toClient.close();
        } else {
            String path = request.getSession().getServletContext().getRealPath("");
            String url = path + "/img/nopic.jpg";
            FileInputStream hFile = new FileInputStream(url);
            // 得到文件大小
            int i = hFile.available();
            byte data[] = new byte[i];
            // 读数据
            hFile.read(data);
            // 得到向客户端输出二进制数据的对象
            OutputStream toClient = response.getOutputStream();
            // 输出数据
            toClient.write(data);
            toClient.flush();
            toClient.close();
            hFile.close();
        }
    }
}
