package com.epiis.reservacanchas.business;

import com.epiis.reservacanchas.entity.EntityTransaction;
import com.epiis.reservacanchas.repository.RepositoryTransaction;
import com.epiis.reservacanchas.dto.request.RequestTransactionInsert;
import com.epiis.reservacanchas.dto.response.ResponseTransactionGet;
import com.epiis.reservacanchas.staticdata.EnumTransactionType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class BusinessTransaction {

    private final RepositoryTransaction repositoryTransaction;

    public BusinessTransaction(RepositoryTransaction repositoryTransaction) {
        this.repositoryTransaction = repositoryTransaction;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAll(String complexId) {
        List<EntityTransaction> transactions = repositoryTransaction.findByComplexId(complexId);
        List<Map<String, Object>> list = new ArrayList<>();
        for (EntityTransaction t : transactions) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", t.getIdTransaction());
            map.put("complexId", t.getComplexId());
            map.put("type", t.getType().name().toLowerCase());
            map.put("description", t.getDescription());
            map.put("amount", t.getAmount());
            map.put("date", t.getDate());
            list.add(map);
        }
        return list;
    }

    @Transactional
    public ResponseTransactionGet insert(RequestTransactionInsert request) {
        ResponseTransactionGet response = new ResponseTransactionGet();

        EntityTransaction transaction = new EntityTransaction();
        transaction.setIdTransaction(UUID.randomUUID().toString());
        transaction.setComplexId(request.getComplexId());
        transaction.setType(EnumTransactionType.valueOf(request.getType().toUpperCase()));
        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setDate(request.getDate());
        transaction.setCreatedAt(new Date());
        transaction.setUpdatedAt(new Date());

        repositoryTransaction.save(transaction);

        response.setId(transaction.getIdTransaction());
        response.setComplexId(transaction.getComplexId());
        response.setType(transaction.getType().name().toLowerCase());
        response.setDescription(transaction.getDescription());
        response.setAmount(transaction.getAmount());
        response.setDate(transaction.getDate());

        response.success();
        response.getListMessage().add("Transacción registrada exitosamente.");
        return response;
    }
}
