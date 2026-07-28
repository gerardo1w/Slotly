package com.epiis.reservacanchas.business;

import com.epiis.reservacanchas.entity.EntityClosure;
import com.epiis.reservacanchas.entity.EntityTransaction;
import com.epiis.reservacanchas.repository.RepositoryClosure;
import com.epiis.reservacanchas.repository.RepositoryTransaction;
import com.epiis.reservacanchas.dto.request.RequestClosureInsert;
import com.epiis.reservacanchas.dto.response.ResponseClosureGet;
import com.epiis.reservacanchas.staticdata.EnumTransactionType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class BusinessClosure {

    private final RepositoryClosure repositoryClosure;
    private final RepositoryTransaction repositoryTransaction;

    public BusinessClosure(RepositoryClosure repositoryClosure, RepositoryTransaction repositoryTransaction) {
        this.repositoryClosure = repositoryClosure;
        this.repositoryTransaction = repositoryTransaction;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAll(String complexId) {
        List<EntityClosure> closures = repositoryClosure.findByComplexId(complexId);
        List<Map<String, Object>> list = new ArrayList<>();
        for (EntityClosure c : closures) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", c.getIdClosure());
            map.put("complexId", c.getComplexId());
            map.put("date", c.getDate());
            map.put("totalIncomes", c.getTotalIncomes());
            map.put("totalExpenses", c.getTotalExpenses());
            map.put("finalBalance", c.getFinalBalance());
            map.put("closedBy", c.getClosedBy());
            list.add(map);
        }
        return list;
    }

    @Transactional
    public ResponseClosureGet insert(RequestClosureInsert request) {
        ResponseClosureGet response = new ResponseClosureGet();

        List<EntityTransaction> transactions = repositoryTransaction.findByComplexId(request.getComplexId());
        double totalIncomes = 0.0;
        double totalExpenses = 0.0;

        for (EntityTransaction t : transactions) {
            if (t.getType() == EnumTransactionType.INCOME) {
                totalIncomes += t.getAmount();
            } else if (t.getType() == EnumTransactionType.EXPENSE) {
                totalExpenses += t.getAmount();
            }
        }

        double finalBalance = totalIncomes - totalExpenses;
        String currentDateStr = new SimpleDateFormat("yyyy-MM-dd").format(new Date());

        EntityClosure closure = new EntityClosure();
        closure.setIdClosure(UUID.randomUUID().toString());
        closure.setComplexId(request.getComplexId());
        closure.setDate(currentDateStr);
        closure.setTotalIncomes(totalIncomes);
        closure.setTotalExpenses(totalExpenses);
        closure.setFinalBalance(finalBalance);
        closure.setClosedBy(request.getClosedBy());
        closure.setCreatedAt(new Date());
        closure.setUpdatedAt(new Date());

        repositoryClosure.save(closure);

        response.setId(closure.getIdClosure());
        response.setComplexId(closure.getComplexId());
        response.setDate(closure.getDate());
        response.setTotalIncomes(closure.getTotalIncomes());
        response.setTotalExpenses(closure.getTotalExpenses());
        response.setFinalBalance(closure.getFinalBalance());
        response.setClosedBy(closure.getClosedBy());

        response.success();
        response.getListMessage().add("Cierre de caja generado exitosamente.");
        return response;
    }
}
