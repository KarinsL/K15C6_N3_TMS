package com.k15c6.tms.health;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.k15c6.tms.security.JwtService;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class HealthControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Test
    void healthIsPublic() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    void protectedEndpointRequiresToken() throws Exception {
        mockMvc.perform(get("/api/v1/anything"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void validAccessTokenPassesAuthentication() throws Exception {
        String token = jwtService.generateAccessToken("admin@tms.local", List.of("ADMIN"));
        // Authenticated, but no handler exists for this path yet, so 404 rather than 401.
        mockMvc.perform(get("/api/v1/anything").header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    void refreshTokenIsRejectedAsAccessToken() throws Exception {
        String token = jwtService.generateRefreshToken("admin@tms.local");
        mockMvc.perform(get("/api/v1/anything").header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }
}
