package com.playground.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // In a real app, this should be in application.properties and much more
    // secure/long
    private static final String SECRET = "MySuperSecretStickerKeyForThePlaygroundThatIsVeryLongAndSecure";
    private static final Key KEY = Keys.hmacShaKeyFor(SECRET.getBytes());
    private static final long EXPIRATION_TIME = 1000 * 60 * 15; // 15 minutes

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String validateTokenAndGetUsername(String token) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(KEY)
                    .build()
                    .parseClaimsJws(token);
            return claims.getBody().getSubject();
        } catch (JwtException | IllegalArgumentException e) {
            // Log error in real app
            return null;
        }
    }
}
