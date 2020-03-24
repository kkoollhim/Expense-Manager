import { NestedTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';

interface FoodNode {
  name: string;
  allocation: number;
  children?: FoodNode[];
}
const TREE_DATA: FoodNode[] = [
  {
    name: 'Manager',
    allocation: 300,
    children: [
      { name: 'Developer', allocation: 1000 },
      { name: 'QA Tester', allocation: 500 }
    ]
  }, {
    name: 'Manager',
    allocation: 300,
    children: [
      {
        name: 'Manager',
        allocation: 300,
        children: [
          { name: 'Developer', allocation: 1000 },
          { name: 'QA Tester', allocation: 500 }
        ]
      },
      { name: 'Developer', allocation: 1000 },
      { name: 'QA Tester', allocation: 500 },
      { name: 'Manager', allocation: 300 }

    ]
  }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  resources: Array<object> = [{ name: "Developer A", allocation: 1000 }, { name: "QA Tester A", allocation: 500 }, { name: "Manager A", allocation: 300 }, { name: "Developer B", allocation: 1000 }, { name: "QA Tester B",allocation:500}];
  expenses: Array<string> = [];

  constructor() {
    this.dataSource.data = TREE_DATA;
  }
  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  protected _add(newNode: FoodNode, parent: FoodNode, tree: FoodNode) {
    if (tree === parent) {
      console.log(
        `replacing children array of '${parent.name}', adding ${newNode.name}`
      );
      tree.children = [...tree.children!, newNode];
      this.treeControl.expand(tree);
      return true;
    }
    if (!tree.children) {
      console.log(`reached leaf node '${tree.name}', backing out`);
      return false;
    }
    return this.update(tree, this._add.bind(this, newNode, parent));
  }
  protected update(tree: FoodNode, predicate: (n: FoodNode) => boolean) {
    let updatedTree: FoodNode, updatedIndex: number;

    tree.children!.find((node, i) => {
      if (predicate(node)) {
        console.log(`creating new node for '${node.name}'`);
        updatedTree = { ...node };
        updatedIndex = i;
        this.moveExpansionState(node, updatedTree);
        return true;
      }
      return false;
    });

    if (updatedTree!) {
      console.log(`replacing node '${tree.children![updatedIndex!].name}'`);
      tree.children![updatedIndex!] = updatedTree!;
      return true;
    }
    return false;
  }
  moveExpansionState(from: FoodNode, to: FoodNode) {
    if (this.treeControl.isExpanded(from)) {
      console.log(`'${from.name}' was expanded, setting expanded on new node`);
      this.treeControl.collapse(from);
      this.treeControl.expand(to);
    }
  }

  moveToRight(resource) {
    this.dataSource.data.push(resource)
    this.expenses.push(resource)
    console.log(this.expenses);
    console.log("data = ",this.dataSource.data)
   
   
    // alert();
    // const p = {
    //   name: 'Manager',
    //   allocation: 300,
    //   children: [
    //     { name: 'Developer', allocation: 1000 },
    //     { name: 'QA Tester', allocation: 500 }
    //   ]
    // }
    // this._add(resource,p,resource );
    
    // const newTreeData = { name: "Dummy Root", children: this.data };
    // this.data = resource.children;
  
  }
  calculateExpenses() {
    var arr = [];
    console.log(this.dataSource.data)
    this.dataSource.data.forEach(e => {
      arr.push(e.allocation);
      e.children.forEach(e => {
        arr.push(e.allocation);
      })
    })
    console.log("Final ARRAY = ", arr)
    const finalAllocation = arr.reduce((acc, val) => acc + val);
    console.log("finalAllocation = ", finalAllocation)


    // var sum = this.dataSource.data.reduce(
    //   (accumulator, currentValue) => {
    //     console.log("children = ", currentValue.children.forEach(element => {
    //       arr.push(element.allocation);
    //     });
    //     return accumulator + currentValue.allocation;
    //   }, 0)
    // console.log("sum = ", sum);
  }

}
