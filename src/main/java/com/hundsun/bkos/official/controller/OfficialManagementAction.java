package com.hundsun.bkos.official.controller;


import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.common.cache.CacheManager;
import com.common.cache.CacheStategy;
import com.common.utils.PropsUtils;
import com.hundsun.bkos.base.MessageDTO;
import com.hundsun.bkos.base.ReturnDTO;
import com.hundsun.bkos.common.controller.BaseAction;
import com.hundsun.bkos.common.interfaces.IPublicShareService;
import com.hundsun.bkos.common.query.AdjunctQuery;
import com.hundsun.bkos.common.query.OfficialParamQuery;
import com.hundsun.bkos.common.services.RestApiClientService;
import com.hundsun.bkos.common.services.RestApiService;
import com.hundsun.bkos.common.util.OkHttpUtils;
import com.hundsun.bkos.official.dto.OfficialImgDTO;
import com.hundsun.bkos.official.interfaces.IOfficialService;
import com.hundsun.bkos.permission.annotation.Operation;
import com.hundsun.bkos.permission.dto.UserTokenDTO;
import com.hundsun.bkos.personalinfo.interfaces.IPersonalInfoService;
import com.hundsun.jresplus.exception.BaseException;

@SuppressWarnings("unchecked")
@Controller
@RequestMapping("/official/officialmanagement")
public class OfficialManagementAction extends BaseAction {

    @Autowired
    private IOfficialService officialService;
    @Autowired
    private IPublicShareService shareService;
    @Autowired
    private RestApiService restApiService;
    @Autowired
    private IPersonalInfoService personalInfoService;

    private final static Logger logger = LoggerFactory.getLogger(OfficialManagementAction.class);

    public static Map<String, OfficialImgDTO> imgMap;
    static {
        try {
			imgMap = CacheManager.getOrCreateCache(CacheStategy.CACHE_PROVIDER_REDIS,"imgPubAvatarMap", String.class, OfficialImgDTO.class);
		} catch (Exception e) {
			logger.error("CacheManager create error:" + e.getMessage());
		}
    }

    @RequestMapping("/updateOfficial.json")
    @ResponseBody
    @Operation(index = 30, roles = "7", code = "updateOfficial", name = "修改公众号信息", desc = "修改公众号信息")
    public MessageDTO updateOfficial(HttpServletRequest request, OfficialParamQuery query) {
        MessageDTO message = new MessageDTO();
        message.setSuccess(true);
        try {
            query.setOffaccNo(getUserNo(request));
            ReturnDTO ret = shareService.updateOfficial(query);
            if (ret.getErrorNo() != 0) {
                message.setSuccess(false);
                message.setMessage("参数异常");
                return message;
            }
            if (!StringUtils.isBlank(query.getOffaccAutoReply())) {
                shareService.updateOfficialAutoReply(query);
            }
            // 创建OFFIm
            restApiService.updateOfficialAccount(query);
            OfficialImgDTO imgDto = null;
            // 获取头像缓存出现异常不影响修改公众号正确返回
            try {
                imgDto = imgMap.get(request.getSession().getId());
            } catch (Exception e) {
                logger.error("updateOfficial avatar is null");
            }
            if ("1".equals(query.getAvatarStr()) && imgDto != null
                    && imgDto.getImgByte().length > 0) {
                UserTokenDTO token = getUserToken(request);
                AdjunctQuery dto = new AdjunctQuery();
                String url =
                        "http://" + PropsUtils.get("fs.server.host") + ":"
                                + PropsUtils.get("fs.server.port") + "/"
                                + PropsUtils.get("fs.server.path");
                String urlauth = url + PropsUtils.get("fs.client.auth.path");
                String urlupload = url + PropsUtils.get("fs.client.upload.path");
                String auth = OkHttpUtils.fileServesAuth(getUserNo(request), urlauth);
                String uuid =
                        OkHttpUtils.fileByteDataUpload(imgDto.getImgByte(), auth, urlupload,
                                imgDto.getUploadFileName());
                if (StringUtils.isBlank(uuid)) {
                    message.setMessage("消息上传失败!");
                    message.setSuccess(false);
                    logger.error("multiPartFormDataUpload callback uuid is null");
                    return message;
                }
                dto.setAdjuncdSuffix(uuid);
                dto.setAdjuncdData("0".getBytes());
                dto.setAdjuncdType("0");
                // 修改用户头像
                dto.setOfficialAccountId(token.getUserId());
                personalInfoService.dealOfficialAdjunct(dto);
                // // 修改openfire用户，触发头像同步
                // restApiClientService.updateUser(token.getUserNo(), token.getUserRealName(), "");
                message.setSuccess(true);
                imgMap.remove(request.getSession().getId());
            }
        } catch (Exception e) {
            message.setSuccess(false);
            message.setMessage("修改公众号失败");
            logger.error("updateOfficial is error:" + e.getMessage());
            return message;
        }
        return message;
    }

    @RequestMapping("/updateOfficialPwd.json")
    @ResponseBody
    @Operation(index = 31, roles = "7", code = "updateOfficialPwd", name = "修改公众号密码", desc = "修改公众号密码")
    public MessageDTO updateOfficialPwd(HttpServletRequest request, OfficialParamQuery query) {
        MessageDTO message = new MessageDTO();
        message.setSuccess(true);
        try {
            query.setOfficialAccountId(getUserToken(request).getUserId());
            ReturnDTO ret = officialService.updateOfficialPwd(query);
            if (ret.getErrorNo() != 0) {
                message.setSuccess(false);
                message.setMessage("参数异常");
                return message;
            }
        } catch (BaseException e) {
            String errorInfo = e.getMessage();
            if (StringUtils.isNotBlank(errorInfo)) {
                message.setSuccess(false);
                message.setMessage(checkErrorInfo(errorInfo));
            } else {
                message.setSuccess(false);
                message.setMessage("修改密码失败!");
            }
        } catch (Exception e) {
            message.setSuccess(false);
            message.setMessage("修改密码失败!");
        }
        return message;
    }
}
