import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCurrencyDto } from './currencies.dto';
import { Currency } from './currency.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Currency) private readonly currencyRepository: Repository<Currency>,
  ) {}

  createPair(createCurrencyDto: CreateCurrencyDto) {
    const newPair = this.currencyRepository.create(createCurrencyDto);
    return this.currencyRepository.save(newPair);
  }
      

  getShortestPath(start,end): any {
    const graph = { "A": ["B", "C"], "B":["D","E"],"E":["F"]};

    function bfs(graph, start, end) {
        let queue = [[(start), []]],
            seen = new Set;
    
        while (queue.length) {
            let [curVert, [...path]] = queue.shift();
            path.push(curVert);
            if (curVert === end) return path;
    
            if (!seen.has(curVert) && graph[curVert]) {
                queue.push(...graph[curVert].map(v => [v, path]));
            }
            seen.add(curVert);
        }
    }
    
    let startt = "F"
    let endd = "A"
    if (bfs(graph, startt, endd)) {
      console.log(bfs(graph, startt, endd));
      return bfs(graph, startt, endd)
    }
    else if(bfs(graph, endd, startt)){
      // console.log(bfs(graph, endd, startt).reverse());
      return (bfs(graph, endd, startt)).reverse()
    }
    else{
      "bfs(graph, start, end)"
    }
     

    
}
}
