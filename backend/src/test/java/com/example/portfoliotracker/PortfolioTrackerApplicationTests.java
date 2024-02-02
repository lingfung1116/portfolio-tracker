package com.example.portfoliotracker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

@SpringBootTest
class PortfolioTrackerApplicationTests {

	@Test
	void contextLoads() {
	}
	@DynamicPropertySource
	static void dynamicProperties(DynamicPropertyRegistry registry) {
		registry.add("marketstack.apikey", () -> "default");
		registry.add("twilio.AccountSID", () -> "default");
		registry.add("twilio.AuthToken", () -> "default");
		registry.add("twilio.phoneNumber", () -> "default");

		// Add other dynamic properties here
	}


}
