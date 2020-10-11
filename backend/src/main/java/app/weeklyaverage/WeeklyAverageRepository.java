package app.weeklyaverage;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import javax.persistence.OrderBy;
import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface WeeklyAverageRepository extends CrudRepository<WeeklyAverage, Long> {

      @Query(value = "SELECT * FROM #{#entityName} WHERE year = ?1 AND week = ?2", nativeQuery = true)
      WeeklyAverage findByYearAndWeek(Short year, Byte week);

      @OrderBy("year, week")
      @Query(value = "SELECT * FROM #{#entityName} GROUP BY year, week ORDER BY year, week;", nativeQuery = true)
      List<WeeklyAverage> getAllSortedByYearAndWeek();

      @Modifying
      @Transactional
      @Query(value = "DELETE FROM #{#entityName} WHERE year = ?1 AND week = ?2", nativeQuery = true)
      void deleteByYearAndWeek(Short year, Byte week);

}
