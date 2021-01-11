package app.weeklyaverage;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

class WeeklyAverageId implements Serializable {

    private short year;
    private byte week;

    public WeeklyAverageId(){}

    public WeeklyAverageId(short year, byte week) {
        this.year = year;
        this.week = week;
    }

}

@Getter
@Setter
@Entity(name="weekly_average")
@IdClass(WeeklyAverageId.class)
@Table(name="weekly_average")
public class WeeklyAverage {

    public WeeklyAverage(){}

    public WeeklyAverage(short year, byte week, float weightAverage, short weightMeasurementCount) {
        super();
        this.year = year;
        this.week = week;
        this.weightAverage = weightAverage;
        this.weightMeasurementCount = weightMeasurementCount;
    }

    @Id
    @Column(name="year", nullable = false)
    private short year;

    @Id
    @Column(name="week", nullable = false)
    private byte week;

    @Column(name="weight_average", nullable = false)
    private float weightAverage;

    @Column(name="weight_measurement_count")
    private short weightMeasurementCount;

    @Column(name="user_id", nullable = false)
    private String userId;

}
