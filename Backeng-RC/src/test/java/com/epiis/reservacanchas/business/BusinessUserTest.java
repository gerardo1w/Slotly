package com.epiis.reservacanchas.business;

import com.epiis.reservacanchas.dto.request.RequestUserLogin;
import com.epiis.reservacanchas.dto.request.RequestUserRegister;
import com.epiis.reservacanchas.dto.response.ResponseUserGet;
import com.epiis.reservacanchas.entity.EntityUser;
import com.epiis.reservacanchas.repository.RepositoryComplex;
import com.epiis.reservacanchas.repository.RepositoryUser;
import com.epiis.reservacanchas.staticdata.EnumSubscriptionType;
import com.epiis.reservacanchas.staticdata.EnumUserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BusinessUserTest {

    @Mock
    private RepositoryUser repositoryUser;

    @Mock
    private RepositoryComplex repositoryComplex;

    @InjectMocks
    private BusinessUser businessUser;

    private EntityUser mockUser;
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @BeforeEach
    void setUp() {
        mockUser = new EntityUser();
        mockUser.setIdUser("u-1");
        mockUser.setEmail("juan@gmail.com");
        mockUser.setName("Juan Perez");
        mockUser.setRole(EnumUserRole.CLIENT);
        mockUser.setSubscription(EnumSubscriptionType.FREE);
        mockUser.setBlocked(false);
        mockUser.setPassword(encoder.encode("password123"));
    }

    @Test
    void testRegister_Success_Client() {
        RequestUserRegister request = new RequestUserRegister();
        request.setEmail("nuevo@gmail.com");
        request.setName("Nuevo Usuario");
        request.setPassword("password123");
        request.setRole("client");

        when(repositoryUser.findByEmail("nuevo@gmail.com")).thenReturn(Optional.empty());
        when(repositoryUser.save(any(EntityUser.class))).thenReturn(mockUser);

        ResponseUserGet response = businessUser.register(request);

        assertNotNull(response);
        assertEquals("success", response.getType());
        verify(repositoryUser, times(1)).save(any(EntityUser.class));
    }

    @Test
    void testRegister_EmailAlreadyExists() {
        RequestUserRegister request = new RequestUserRegister();
        request.setEmail("juan@gmail.com");

        when(repositoryUser.findByEmail("juan@gmail.com")).thenReturn(Optional.of(mockUser));

        ResponseUserGet response = businessUser.register(request);

        assertNotNull(response);
        assertEquals("error", response.getType());
        assertTrue(response.getListMessage().get(0).contains("ya se encuentra registrado"));
        verify(repositoryUser, never()).save(any(EntityUser.class));
    }

    @Test
    void testLogin_Success() {
        RequestUserLogin request = new RequestUserLogin();
        request.setEmail("juan@gmail.com");
        request.setPassword("password123");

        when(repositoryUser.findByEmail("juan@gmail.com")).thenReturn(Optional.of(mockUser));

        ResponseUserGet response = businessUser.login(request);

        assertNotNull(response);
        assertEquals("success", response.getType());
        assertEquals("juan@gmail.com", response.getEmail());
    }

    @Test
    void testLogin_UserNotFound() {
        RequestUserLogin request = new RequestUserLogin();
        request.setEmail("noexiste@gmail.com");
        request.setPassword("password123");

        when(repositoryUser.findByEmail("noexiste@gmail.com")).thenReturn(Optional.empty());

        ResponseUserGet response = businessUser.login(request);

        assertNotNull(response);
        assertEquals("error", response.getType());
        assertTrue(response.getListMessage().get(0).contains("incorrectas"));
    }

    @Test
    void testLogin_WrongPassword() {
        RequestUserLogin request = new RequestUserLogin();
        request.setEmail("juan@gmail.com");
        request.setPassword("wrongpassword");

        when(repositoryUser.findByEmail("juan@gmail.com")).thenReturn(Optional.of(mockUser));

        ResponseUserGet response = businessUser.login(request);

        assertNotNull(response);
        assertEquals("error", response.getType());
        assertTrue(response.getListMessage().get(0).contains("incorrectas"));
    }

    @Test
    void testGetAll_ReturnsList() {
        when(repositoryUser.findAll()).thenReturn(Collections.singletonList(mockUser));

        List<Map<String, Object>> list = businessUser.getAll();

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("juan@gmail.com", list.get(0).get("email"));
    }
}