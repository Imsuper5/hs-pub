package com.hundsun.bkos.official.query;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

public class PubLoginQuery {
    @NotBlank(message = "{validation.NotBlank}")
    private String officialAccountUserName;
    @Length(min = 6, max = 20, message = "{validation.Length}")
    private String officialAccountPwd;
    @Max(value = 6, message = "{validation.Max}")
    @Min(value = 1, message = "{validation.Min}")
    private Integer terminalSource;
    // 自定义
    private String timeMillis;
    private String rememberMe;

    public String getOfficialAccountUserName() {
        return officialAccountUserName;
    }

    public void setOfficialAccountUserName(String officialAccountUserName) {
        this.officialAccountUserName = officialAccountUserName;
    }

    public String getOfficialAccountPwd() {
        return officialAccountPwd;
    }

    public void setOfficialAccountPwd(String officialAccountPwd) {
        this.officialAccountPwd = officialAccountPwd;
    }

    public Integer getTerminalSource() {
        return terminalSource;
    }

    public void setTerminalSource(Integer terminalSource) {
        this.terminalSource = terminalSource;
    }

    public String getTimeMillis() {
        return timeMillis;
    }

    public void setTimeMillis(String timeMillis) {
        this.timeMillis = timeMillis;
    }

    public String getRememberMe() {
        return rememberMe;
    }

    public void setRememberMe(String rememberMe) {
        this.rememberMe = rememberMe;
    }

}
