package com.hundsun.bkos.index.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hundsun.bkos.base.MessageDTO;
import com.hundsun.bkos.common.controller.BaseAction;
import com.hundsun.bkos.common.dto.OfficialAccountDTO;
import com.hundsun.bkos.official.interfaces.IOfficialService;
import com.hundsun.bkos.official.query.PubLoginQuery;
import com.hundsun.bkos.permission.annotation.Operation;
import com.hundsun.bkos.permission.dto.UserTokenDTO;
import com.hundsun.bkos.permission.interfaces.IPermissionService;
import com.hundsun.bkos.permission.services.OnlineUser;
import com.hundsun.bkos.permission.typedefine.SystemType;
import com.hundsun.bkos.permission.typedefine.Terminal;
import com.hundsun.bkos.util.AesUtil;
import com.hundsun.jresplus.exception.BaseException;

@Controller
@RequestMapping("")
public class LoginAction extends BaseAction {
    private static final String LAST_EXCEPTION = "LAST_EXCEPTION";
    // 报价行情端异常错误信息
    private static final String SERVICE_LAST_EXCEPTION = "SERVICE_LAST_EXCEPTION";

    private final static Logger logger = LoggerFactory.getLogger(LoginAction.class);

    @Autowired
    private IPermissionService permService;
    @Autowired
    private IOfficialService officialService;



    @RequestMapping("/publogin.htm")
    public void publogin(HttpServletRequest request, ModelMap model)
            throws UnsupportedEncodingException {
        String msg =
                request.getParameter("msg") == null ? "" : URLDecoder.decode(
                        request.getParameter("msg"), "UTF-8");
        OnlineUser.userLogout((String) request.getSession().getId());
        model.addAttribute("msg", msg);
    }


    /**
     * 运维端、公众号登录验证
     * 
     * @param operatorQuery
     * @param checkCode
     * @param loginType
     * @param request
     * @param response
     * @return MessageDTO
     * @throws Exception
     */
    @RequestMapping("/loginCheck.json")
    @ResponseBody
    @Operation(code = "loginCheck", name = "运维端登录校验")
    public MessageDTO loginCheck(PubLoginQuery query, String checkCode, Integer loginType,
            HttpServletRequest request, HttpServletResponse response) throws Exception {
        MessageDTO message = new MessageDTO();
        try {
            String timeMillis = query.getTimeMillis();
            String pwd = query.getOfficialAccountPwd().trim();
            if (StringUtils.isNotBlank(timeMillis) && StringUtils.isNotBlank(pwd)) {
                pwd =
                        AesUtil.decrypt(pwd, timeMillis
                                + "xJIR0Jr5un+S4bJQQFyviMBWWATEhr4VdPKMZ7J==");
            }
            query.setOfficialAccountPwd(pwd);
            query.setTerminalSource(Terminal.WEB.getValue());
            OfficialAccountDTO ret = officialService.loginPubCheck(query);
            if (ret.getErrorNo() != 0) {
                message.setMessage(ret.getErrorInfo());
                message.setSuccess(false);
                return message;
            }
            OnlineUser.userLogoutByUserNo(ret.getOffaccNo());
            OfficialAccountDTO model = ret;
            UserTokenDTO token = new UserTokenDTO();
            token.setUserId(model.getOfficialAccountId());
            token.setUserNo(model.getOffaccNo());
            token.setUserRealName(model.getOfficialAccountNickname());// 姓名
            token.setRoleId(model.getRoleId());// 用户角色
            token.setRoleIdList("");// 用户角色组
            token.setType(SystemType.SYS_OFFICIAL.getValue());// 登录用户类型
            token.setAuthKey(ret.getAuthKey());
            OnlineUser.userLogin(token.getUserCompany(), token.getUserNo(), token, request);
            message.setMessage("登录成功");
            message.setSuccess(true);

            if ("on".equals(query.getRememberMe())) {
                // 记住密码
                timeMillis = String.valueOf(System.currentTimeMillis());
                Cookie nameCookie =
                        new Cookie("MemberUsername", query.getOfficialAccountUserName());
                Cookie pwdCookie =
                        new Cookie("SecretKey", AesUtil.encrypt(query.getOfficialAccountPwd(),
                                timeMillis + "xJIR0Jr5un+S4bJQQFyviMBWWATEhr4VdPKMZ7J=="));
                Cookie timeCookie = new Cookie("TimeMillis", timeMillis);
                // 有效期三天
                nameCookie.setMaxAge(60 * 60 * 24 * 5);
                timeCookie.setMaxAge(60 * 60 * 24 * 5);
                pwdCookie.setMaxAge(60 * 60 * 24 * 5);
                response.addCookie(nameCookie);
                response.addCookie(pwdCookie);
                response.addCookie(timeCookie);
            }
        } catch (BaseException e) {
            String errorInfo = e.getMessage();
            logger.error(errorInfo);
            if (StringUtils.isNotBlank(errorInfo)) {
                message.setSuccess(false);
                message.setMessage(checkErrorInfo(errorInfo));
            } else {
                message.setSuccess(false);
                message.setMessage("登录验证失败!");
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
            message.setSuccess(false);
            message.setMessage("登录验证失败!");
        }
        return message;
    }



    @RequestMapping("/loginOut.htm")
    public void loginOut(HttpServletRequest request, HttpServletResponse response, ModelMap model) {
        // 清空session里的登录信息
        OnlineUser.userLogout(request.getSession().getId());
        // 登录退出时清除Cookie中保存异常的数据
        Cookie[] cookies = request.getCookies();
        if (cookies != null && cookies.length > 0) {
            for (Cookie cookie : cookies) {
                String name = cookie.getName();
                // 找到需要删除的Cookie
                if (name.compareTo(LAST_EXCEPTION) == 0
                        || name.compareTo(SERVICE_LAST_EXCEPTION) == 0) {
                    // 设置生存期为0
                    cookie.setMaxAge(0);
                    // 设回Response中生效
                    response.addCookie(cookie);
                }
            }
        }

        try {
            request.getRequestDispatcher("/WEB-INF/views/screen/nologin.html").forward(request,
                    response);
        } catch (ServletException | IOException e) {
            logger.error(e.getMessage());
        }
    }

    @RequestMapping("/checkBrowserVersion.htm")
    public void checkBrowserVersion(HttpServletRequest request, ModelMap model)
            throws UnsupportedEncodingException {
        String msg =
                request.getParameter("msg") == null ? "" : URLDecoder.decode(
                        request.getParameter("msg"), "UTF-8");
        OnlineUser.userLogout((String) request.getSession().getId());
        model.addAttribute("msg", msg);
    }

}
