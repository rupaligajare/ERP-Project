package rkt.jde.dto;

import lombok.Data;

@Data 
public class OnboardRequest {
    private String org_name;
    private String jde_ais_url;
    private String admin_name;
    private String admin_email;
}