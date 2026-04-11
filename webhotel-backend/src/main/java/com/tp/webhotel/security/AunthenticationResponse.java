package com.tp.webhotel.security;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AunthenticationResponse {
    private String token;

}
